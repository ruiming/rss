import FeedParser from 'feedparser'
import request from 'request'
import mongoose from 'mongoose'
import process from 'process'
import config from '../config/config'
import FeedModel from '../models/feed'
import PostModel from '../models/post'
import UserFeedModel from '../models/userFeed'

mongoose.connect(`mongodb://${config.MONGODB.USER}:${config.MONGODB.PASSWORD}@${config.MONGODB.HOST}:${config.MONGODB.PORT}/${config.MONGODB.NAME}`)
mongoose.Promise = require('bluebird')
global.Promise = require('bluebird')
/**
 * 定时更新订阅源
 */
async function update() {
  const items = await FeedModel.find({}, {
    absurl: 1,
    _id:    1,
  })
  const starttime = Date.now()
  let updateCount = 0
  let newCount = 0
  let equalCount = 0
  const promises = items.map(item => new Promise(resolve => {
    const req = request({
      url:     item.absurl,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.71 Safari/537.36',
      },
      timeout: 10000,
    })
    const feedparser = new FeedParser()
    FeedModel.update({
      _id: item._id,
    }, {
      recent_update: Date.now(),
    })
    req.on('response', res => {
      if (res.statusCode !== 200) {
        console.log(`#1 ${res.statusCode} -- ${item.absurl}`)
        resolve()
      } else {
        res.pipe(feedparser)
        feedparser.on('error', err => {
          console.log(`#2 ${err} -- ${item.absurl}`)
          resolve()
        })
      }
    })
    req.on('error', err => {
      console.log(`#3 ${err} -- ${item.absurl}`)
      resolve()
    })
    feedparser.on('readable', async function () {
      let result
      // eslint-disable-next-line
      while (result = this.read()) {
        // Use guid to identify...
        const origin = await PostModel.findOne({
          guid:    result.guid,
          feed_id: item._id,
        })
        if (origin && origin._id) {
          if (origin.link && (origin.link.toString() === result.link.toString())) {
            equalCount++
          } else {
            Object.assign(origin, result)
            origin.save()
            updateCount++
          }
        } else {
          // TODO: Invalid Date Cast failed
          if (Object.prototype.toString.call(result.pubdate) !== '[object Date]') {
            result.pubdate = null
          }
          if (Object.prototype.toString.call(result.date) !== '[object Date]') {
            result.date = null
          }
          const post = new PostModel(Object.assign(result, {
            feed_id: item._id,
          }))
          newCount++
          post.save()
          UserFeedModel.update({
            feed_id: item._id,
          }, {
            $inc: {
              unread: 1,
            },
          })
        }
      }
    })
    feedparser.on('end', () => {
      resolve()
    })
  }))
  Promise.all(promises).then(() => {
    setTimeout(() => {
      console.log('\r\n************* OK *************')
      console.log(Date().toLocaleString())
      console.log(`FeedNum: ${items.length}`)
      console.log(`TimeUsed: ${(Date.now() - starttime) / 1000} s`)
      console.log(`Equal: ${equalCount}`)
      console.log(`Update: ${updateCount}`)
      console.log(`New: ${newCount}`)
      console.log('************* OK *************\r\n')
      process.exit()
    }, 100)
  }).catch(err => {
    console.log(err)
  })
}
update()
