import FeedModel from '../models/feed'
import PostModel from '../models/post'
import UserFeedModel from '../models/userFeed'
import UserPostModel from '../models/userPost'
import FeedParser from 'feedparser'
import request from 'request'
import utils from '../utils'
import fetchFavicon from 'favicon-getter'
import fs from 'fs'
import { SHA256 } from 'crypto-js'

/**
 * 搜索订阅源
 * @method:post
 * @link:  /api/feed
 * @param: feedlink
 */
exports.create = async (ctx, next) => {
    let feedlink = ctx.request.body.feedlink && ctx.request.body.feedlink.trim()
    if (!utils.checkUrl(feedlink)) {
        ctx.throw(400, 'URL 不合法')
    } else {
        let user_id = ctx.state.user.id,
            feedparser = new FeedParser()
        // 查询数据库是否存在该订阅源
        let result = await FeedModel.findOne({
            absurl: feedlink
        })
        if (result && result._id) {
            return ctx.body = {
                success: true,
                data:    result._id
            }
        } else {
            await new Promise(async (resolve, reject) => {
                let req
                // request
                try {
                    req = request({
                        url:     feedlink,
                        headers: {
                            'User-Agent': 'request'
                        },
                        timeout: 5000
                    })
                } catch (e) {
                    // request 出错
                    reject(e)
                }
                req.on('response', res => {
                    if (res.statusCode !== 200) {
                        // 非 200 response
                        res.on('data', () => {
                            reject(`Error: 错误状态码 ${res.statusCode}`)
                        })
                    } else {
                        res.pipe(feedparser)
                        // feedparser 错误
                        feedparser.on('error', err => {
                            if (err) {
                                reject(err)
                            } else {
                                resolve()
                            }
                        })
                    }
                })
                // req 错误
                req.on('error', err => reject(err))
                // feedparser 获取 feed meta
                feedparser.on('meta', async function () {
                    let favicon = null,
                        hash = SHA256(this.meta.link).toString().slice(0, 10)
                    // 获取 favicon
                    await fetchFavicon(this.meta.link).then(data => favicon = data).catch(e => e)
                    await new Promise(resolve => request(favicon, (err, response) => {
                        if (response && response.statusCode === 200 && /image/.test(response.headers['content-type'])) {
                            request.get(favicon).pipe(fs.createWriteStream(__dirname + '/../public/favicon/' + hash + '.ico'))
                            favicon = `/favicon/${hash}.ico`
                        } else {
                            favicon = '/favicon/rss.png'
                        }
                        resolve(favicon)
                    }))
                    let data = {
                        absurl: feedlink,
                        favicon
                    }
                    // 存储 Feed
                    let feed = new FeedModel({
                        ...this.meta,
                        ...data,
                        lastScan: Date.now()
                    })
                    let store = await feed.save()
                    let feedid = store._id,
                        link = store.link,
                        count = 0
                    // 获取 Feed posts
                    feedparser.on('readable', function () {
                        while (result = this.read()) {
                            let post = new PostModel({
                                ...result,
                                feed_id: feedid,
                                website: link
                            })
                            post.save()
                            count++
                        }
                    })
                    // 大功告成
                    feedparser.on('end', function () {
                        ctx.body = {
                            success: true,
                            data:    store._id
                        }
                        resolve()
                    })
                })
            })
        }
    }
}


/**
 * 订阅订阅源
 * @method: put
 * @link:   /api/feed/{id}
 */
exports.subscribe = async (ctx, next) => {
    let feed_id = ctx.params.id,
        user_id = ctx.state.user.id
    // 查找数据库是否有该订阅源
    let result = await FeedModel.findOne({
        _id: feed_id
    })
    if (result && result._id) {
        let userresult = await UserFeedModel.findOne({
            user_id,
            feed_id: result._id
        })
        // 查看用户是否已经订阅该订阅源
        if (userresult && userresult._id) {
            ctx.throw(409, `已订阅源 ${result.title}(${result.id})`)
        } else {
            result.feedNum += 1
            result.save()
            // 获取订阅源的用户未读数量
            let count = await PostModel.find({
                feed_id
            }).count()
            let readcount = await UserPostModel.find({
                feed_id
            }).count()
            let userfeed = new UserFeedModel({
                feed_id,
                unread: count - readcount,
                user_id
            })
            userfeed.save()
            return ctx.body = {
                success: true,
                data:    result
            }
        }
    } else {
        ctx.throw(404, '不存在该订阅源，　请尝试使用搜索')
    }
}

/**
 * 获取 订阅源信息
 * @method: get
 * @link:   /api/feed/{id}
 */
exports.list = async (ctx, next) => {
    let id = ctx.params.id,
        user_id = ctx.state.user.id,
        unreadcount, count, result
    // 计算订阅源未读数
    await Promise.all([
        Promise.resolve().then(async () => unreadcount = await UserPostModel.count({
            feed_id: id,
            read:    true,
            user_id
        })),
        Promise.resolve().then(async () => count = await PostModel.count({
            feed_id: id
        }))
    ])
    // 查看用户是否已订阅
    await UserFeedModel.findOne({
        user_id,
        feed_id: id
    }, {
        user_id: 0
    }).populate('feed_id').lean().exec((err, data) => {
        if (data !== null) {
            data = {
                ...data.feed_id[0],
                ...data,
                _id:     data.feed_id[0]._id,
                feed_id: data.feed_id[0]._id,
                unread:  count - unreadcount
            }
        }
        return result = data
    })
    if (result && result._id) {
        ctx.body = {
            success: true,
            data:    result
        }
    } else {
        await FeedModel.findOne({
            _id: id
        }).lean().exec((err, data) => {
            return result = {
                ...data,
                unread: count - unreadcount
            }
        })
        if (result && result._id) {
            ctx.body = {
                success: true,
                data:    result
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
 */
exports.listAll = async (ctx, next) => {
    let user_id = ctx.state.user.id, items
    await UserFeedModel.find({
        user_id
    }, {
        user_id: 0
    })
    .populate('feed_id', {
        favicon: 1,
        title:   1
    }).lean().exec((err, data) => {
        return  items = data.map(item => {
            return {
                ...item.feed_id[0],
                ...item,
                feed_title: item.feed_id[0].title,
                feed_id:    item.feed_id[0]._id,
                _id:        item.feed_id[0]._id
            }
        })
    })
    await Promise.all(items.map(item => new Promise(async (resolve) => {
        let unreadcount, count
        await Promise.all([
            Promise.resolve().then(async () => unreadcount = await UserPostModel.count({
                feed_id: item.feed_id,
                read:    true,
                user_id
            })),
            Promise.resolve().then(async () => count = await PostModel.count({
                feed_id: item.feed_id
            }))
        ])
        resolve({
            ...item,
            unread: count - unreadcount
        })
    }))).then(items => {
        ctx.body = {
            success: true,
            data:    items
        }
    })
}

/**
 * 取消/删除 订阅源
 * @method: delete
 * @link:   /api/feed/{id}
 * @param:  {string} feed_id
 */
exports.unsubscribe = async (ctx, next) => {
    let user_id = ctx.state.user.id,
        feed_id = ctx.params.id
    let result = await UserFeedModel.find({
        user_id,
        feed_id
    }).remove()
    if (result.result.n === 0) {
        ctx.throw(404, '你没有订阅该订阅源')
    } else {
        setTimeout(async () => {
            await FeedModel.update({
                _id: feed_id
            }, {
                $inc: {
                    feedNum: -1
                }
            })
        }, 0)
        return ctx.body = {
            success: true,
            data:    '取消订阅成功'
        }
    }
}
