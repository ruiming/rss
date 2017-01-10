import FeedParser from 'feedparser'
import request from 'request'
import fetchFavicon from 'favicon-getter'
import { SHA256 } from 'crypto-js'
import fs from 'fs'
import utils from '../utils'
import FeedModel from '../models/feed'
import PostModel from '../models/post'
import UserFeedModel from '../models/userFeed'
import UserPostModel from '../models/userPost'

/**
 * 搜索订阅源
 * @method:post
 * @link:  /api/feed
 * @param: feedlink
 * @date: 2017.1.10
 */
exports.create = async (ctx, next) => {
  const feedlink = ctx.request.body.feedlink && ctx.request.body.feedlink.trim()
  if (!utils.checkUrl(feedlink)) {
    ctx.throw(400, 'URL 不合法')
  } else {
    const feedparser = new FeedParser()
    // 查询数据库是否存在该订阅源
    let result = await FeedModel.findOne({
      absurl: feedlink,
    })
    if (result && result._id) {
      return ctx.body = {
        success: true,
        data:    result._id,
      }
    }
    await new Promise(async (resolve, reject) => {
      let req
      try {
        req = request({
          url:     feedlink,
          headers: {
            'User-Agent': 'request',
          },
          timeout: 5000,
        })
      } catch (e) {
        reject(e)
      }
      req.on('response', res => {
        if (res.statusCode !== 200) {
          res.on('data', () => {
            reject(Error(`错误状态码 ${res.statusCode}`))
          })
        } else {
          res.pipe(feedparser)
          feedparser.on('error', err => {
            if (err) {
              reject(err)
            } else {
              resolve()
            }
          })
        }
      })
      req.on('error', err => reject(err))
      feedparser.on('meta', async function () {
        const hash = SHA256(this.meta.link).toString().slice(0, 10)
        let favicon = null
        await fetchFavicon(this.meta.link).then(data => favicon = data).catch(e => e)
        await new Promise(resolve => request(favicon, (err, response) => {
          if (response && response.statusCode === 200 && /image/.test(response.headers['content-type'])) {
            request.get(favicon).pipe(fs.createWriteStream(`${__dirname}/../public/favicon/${hash}.ico`))
            favicon = `/favicon/${hash}.ico`
          } else {
            favicon = '/favicon/rss.png'
          }
          resolve(favicon)
        }))
        const data = {
          absurl: feedlink,
          favicon,
        }
        const feed = new FeedModel({
          ...this.meta,
          ...data,
          lastScan: Date.now(),
        })
        const store = await feed.save()
        const feedid = store._id
        const link = store.link
        feedparser.on('readable', () => {
          // eslint-disable-next-line
          while (result = this.read()) {
            const post = new PostModel({
              ...result,
              feed_id: feedid,
              website: link,
            })
            post.save()
          }
        })
        feedparser.on('end', () => {
          ctx.body = {
            success: true,
            data:    store._id,
          }
          resolve()
        })
      })
    })
  }
  return ctx.body
}


/**
 * 订阅订阅源
 * @method: put
 * @link:   /api/feed/{id}
 * @date: 2017.1.10
 */
exports.subscribe = async (ctx, next) => {
  const feed_id = ctx.params.id
  const user_id = ctx.state.user.id
  const result = await FeedModel.findOne({
    _id: feed_id,
  })
  if (result && result._id) {
    const userresult = await UserFeedModel.findOne({
      user_id,
      feed_id: result._id,
    })
    if (userresult && userresult._id) {
      ctx.throw(409, `已订阅源 ${result.title}(${result.id})`)
    } else {
      result.feedNum += 1
      result.save()
      let count = 0
      let readcount = 0
      await Promise.all([
        PostModel.find({
          feed_id,
        }).count(),
        UserPostModel.find({
          feed_id,
        }).count()]).then(res => {
          [count, readcount] = res
        })
      const userfeed = new UserFeedModel({
        feed_id,
        user_id,
        unread: count - readcount,
      })
      userfeed.save()
      return ctx.body = {
        success: true,
        data:    result,
      }
    }
  } else {
    ctx.throw(404, '不存在该订阅源,请尝试使用搜索')
  }
  return ctx.body
}

/**
 * 获取 订阅源信息
 * @method: get
 * @link:   /api/feed/{id}
 * @date: 2017.1.10
 */
exports.list = async (ctx, next) => {
  const id = ctx.params.id
  const user_id = ctx.state.user.id
  let unreadcount
  let count
  let result
  await Promise.all([
    UserPostModel.count({
      feed_id: id,
      read:    true,
      user_id,
    }),
    PostModel.count({
      feed_id: id,
    }),
  ]).then(res => {
    [unreadcount, count] = res
  })
  await UserFeedModel.findOne({
    user_id,
    feed_id: id,
  }, {
    user_id: 0,
  }).populate('feed_id').lean().exec((err, data) => {
    if (data != null) {
      data = {
        ...data.feed_id[0],
        ...data,
        _id:     data.feed_id[0]._id,
        feed_id: data.feed_id[0]._id,
        unread:  count - unreadcount,
      }
    }
    return result = data
  })
  if (result && result._id) {
    ctx.body = {
      success: true,
      data:    result,
    }
  } else {
    await FeedModel.findOne({
      _id: id,
    }).lean().exec((err, data) => result = {
      ...data,
      unread: count - unreadcount,
    })
    if (result && result._id) {
      ctx.body = {
        success: true,
        data:    result,
      }
    } else {
      ctx.throw(404, '订阅源不存在')
    }
  }
}

/**
 * 获取 全部订阅源
 * @method: get
 * @link:   /api/feed
 * @date: 2017.1.10
 */
exports.listAll = async (ctx, next) => {
  const user_id = ctx.state.user.id
  let items
  await UserFeedModel.find({
    user_id,
  }, {
    user_id: 0,
  })
  .populate('feed_id', {
    favicon: 1,
    title:   1,
  }).lean().exec((err, data) => items = data.map(item => ({
    ...item.feed_id[0],
    ...item,
    feed_title: item.feed_id[0].title,
    feed_id:    item.feed_id[0]._id,
    _id:        item.feed_id[0]._id,
  })))
  await Promise.all(items.map(item => new Promise(async resolve => {
    let unreadcount
    let count
    await Promise.all([
      UserPostModel.count({
        feed_id: item.feed_id,
        read:    true,
        user_id,
      }),
      PostModel.count({
        feed_id: item.feed_id,
      }),
    ]).then(res => {
      [unreadcount, count] = res
    })
    resolve({
      ...item,
      unread: count - unreadcount,
    })
  }))).then(result => {
    ctx.body = {
      success: true,
      data:    result,
    }
  })
}

/**
 * 取消/删除 订阅源
 * @method: delete
 * @link:   /api/feed/{id}
 * @param:  {string} feed_id
 * @date: 2017.1.10
 */
exports.unsubscribe = async (ctx, next) => {
  const user_id = ctx.state.user.id
  const feed_id = ctx.params.id
  const result = await UserFeedModel.find({
    user_id,
    feed_id,
  }).remove()
  if (result.result.n === 0) {
    ctx.throw(404, '你没有订阅该订阅源')
  } else {
    setTimeout(async () => {
      await FeedModel.update({
        _id: feed_id,
      }, {
        $inc: {
          feedNum: -1,
        },
      })
    }, 0)
    return ctx.body = {
      success: true,
      data:    '取消订阅成功',
    }
  }
}
