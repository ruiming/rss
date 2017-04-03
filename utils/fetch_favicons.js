import mongoose from 'mongoose'
import process from 'process'
import _ from 'underscore'
import fs from 'fs'
import { SHA256 } from 'crypto-js'
import request from 'request'
import fetchFavicon from 'favicon-getter'
import FeedModel from '../models/feed'
import help from '../utils/'
import config from '../config/config'

mongoose.connect(`mongodb://${config.MONGODB.USER}:${config.MONGODB.PASSWORD}@${config.MONGODB.HOST}:${config.MONGODB.PORT}/${config.MONGODB.NAME}`)
mongoose.Promise = require('bluebird')
global.Promise = require('bluebird')

async function fetch() {
  const feeds = await FeedModel.find({}, {
    absurl:  1,
    favicon: 1,
    link:    1,
  })
  let count = 0
  const number = feeds.length
  await Promise.all(_.map(feeds, feed => new Promise(async resolve => {
    let url = null
    const hash = SHA256(feed.link).toString().slice(0, 10)
    await fetchFavicon(feed.absurl).then(data => url = data)
    request(url, (err, response) => {
      if (response && response.statusCode === 200 && /image/.test(response.headers['content-type'])) {
                // New Favicon
        request.get(url).pipe(fs.createWriteStream(`${__dirname}/../public/favicon/${hash}.ico`))
                // Store it
        feed.favicon = `/favicon/${hash}.ico`
        feed.save()
        count++
      } else {
        feed.favicon = '/favicon/rss.png'
        feed.save()
      }
      resolve()
    })
  })))
  console.log(`${Date().toLocaleString()}-- 目前有 ${number} 个订阅源, 共更新 ${count} 个订阅源的 favicon`)
  process.exit()
}

fetch()
