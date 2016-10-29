import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserFeedModel from '../models/userFeed';
import UserPostModel from '../models/userPost';
import FeedParser from 'feedparser';
import request from 'request';
import help from '../helper/help';
import fetchFavicon from 'favicon-getter';
import _ from 'underscore';

/**
 * 创建/订阅 订阅源
 * @method: post
 * @link:   /api/feed
 * @param:  feedlink
 * @param:  search
 */
exports.create = async(ctx, next) => {
    let feedlink = ctx.request.body.feedlink && ctx.request.body.feedlink.trim(),
        search = ctx.request.query.search === 'true';
    if (!help.checkUrl(feedlink)) {
        ctx.throw(404, 'URL 不合法');
    }
    let user_id = ctx.state.user.id,
        feedparser = new FeedParser(),
        feed = new FeedModel(),
        _id;
    // 查找数据库是否有该订阅源
    let result = await FeedModel.findOne({
        absurl: feedlink
    });
    // 判断数据库已存在该订阅源
    if (result && result._id) {
        if (search) {
            return ctx.body = {
                success: true,
                data: result._id
            };
        } else {
            let userresult = await UserFeedModel.findOne({
                user_id: user_id,
                feed_id: result._id
            });
            // 判断用户是否已经订阅该订阅源
            if (userresult && userresult._id) {
                ctx.throw(409, `已订阅源 ${result.title}(${result.id})`)
            } else {
                // 订阅源的订阅人数 +1
                result.feedNum += 1;
                result.save();
                let count = await PostModel.find({
                    feed_id: result._id
                }).count();
                let userfeed = UserFeedModel({
                    feed_id: result._id,
                    user_id: user_id,
                    unread: count
                });
                // 添加到用户订阅表
                userfeed.save();
                return ctx.body = {
                    success: true,
                    data: result
                };
            }
        }
    } else {
        await new Promise(async(resolve, reject) => {
            let req = request({
                url: feedlink,
                headers: {
                    'User-Agent': 'request'
                }
            });
            req.on('response', res => {
                if (res.statusCode != 200) {
                    res.on("data", chunk => {
                        reject('Error: 目的不可达, 404错误');
                    });
                } else {
                    res.pipe(feedparser);
                    feedparser.on('error', err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
            req.on('error', err => reject(err));
            feedparser.on('meta', async function () {
                let favicon = null;
                await fetchFavicon(this.meta.link).then(data => favicon = data)
                    .catch(e => e);
                await new Promise(resolve => request(favicon, (err, response, body) => {
                    if (response.statusCode != 200) {
                        favicon = '/img/rss.png';
                    }
                    resolve(favicon);
                }));
                let data = search ? {
                    absurl: feedlink,
                    favicon: favicon
                } : {
                    absurl: feedlink,
                    favicon: favicon,
                    feedNum: 1
                };
                let feed = new FeedModel(Object.assign(this.meta, data, {
                    lastScan: Date.now()
                }));
                let store = await feed.save();
                let feedid = store._id,
                    link = store.link,
                    count = 0;
                if (search) {
                    feedparser.on('readable', function () {
                        while (result = this.read()) {
                            let post = new PostModel(Object.assign(result, {
                                feed_id: feedid,
                                website: link
                            }));
                            post.save();
                            count++;
                        }
                    });
                    feedparser.on('end', function () {
                        ctx.body = {
                            success: true,
                            data: store._id
                        };
                        resolve();
                    });
                } else {
                    setTimeout(() => {
                        feedparser.on('readable', function () {
                            while (result = this.read()) {
                                let post = new PostModel(Object.assign(result, {
                                    feed_id: feedid,
                                    website: link
                                }));
                                post.save();
                                count++;
                            }
                        });
                        feedparser.on('end', function () {
                            let userfeed = new UserFeedModel({
                                feed_id: feedid,
                                user_id: user_id,
                                unread: count
                            });
                            userfeed.save();
                        })
                    }, 0);
                    ctx.body = {
                        success: true,
                        data: store
                    };
                    resolve();
                }
            });
        });
    }
}

/**
 * 获取 订阅源信息
 * @method: get
 * @link:   /api/feed/{id}
 */
exports.list = async(ctx, next) => {
    let id = ctx.params.id,
        user_id = ctx.state.user.id;
    let unreadcount, count;
    await Promise.all([
        Promise.resolve().then(async() => unreadcount = await UserPostModel.count({
            feed_id: id,
            user_id: user_id,
            read: true
        })),
        Promise.resolve().then(async() => count = await PostModel.count({
            feed_id: id
        }))
    ]);
    let result = await UserFeedModel.findOne({
        user_id: user_id,
        feed_id: id
    }, {
        user_id: 0
    }).populate('feed_id').lean().exec((err, data) => data ? data.unread = count - unreadcount : data);
    if (result && result._id) {
        ctx.body = {
            success: true,
            data: result
        };
    } else {
        result = await FeedModel.findOne({
            _id: id
        }).lean().exec((err, data) => data ? data.unread = count - unreadcount : data);
        if (result && result._id) {
            ctx.body = {
                success: true,
                data: result
            };
        } else {
            ctx.throw(404, '订阅源不存在');
        }
    }
}

/**
 * 获取 全部订阅源
 * @method: get
 * @link:   /api/feed
 */
exports.listAll = async(ctx, next) => {
    let user_id = ctx.state.user.id;
    let items = await UserFeedModel.find({
            user_id: user_id
        }, {
            user_id: 0
        })
        .populate('feed_id', {
            favicon: 1,
            title: 1
        }).lean().exec();
    Promise.all(_.map(items, item => new Promise(async(resolve, reject) => {
        let unreadcount, count;
        await Promise.all([
            Promise.resolve().then(async() => unreadcount = await UserPostModel.count({
                feed_id: item.feed_id,
                user_id: user_id,
                read: true
            })),
            Promise.resolve().then(async() => count = await PostModel.count({
                feed_id: item.feed_id
            }))
        ]);
        resolve(Object.assign(item, {
            unread: count - unreadcount
        }));
    }))).then(items => {
        ctx.body = {
            success: true,
            data: items
        };
    });
}

/**
 * 取消/删除 订阅源
 * @method: delete
 * @link:   /api/feed/{id}
 * @param:  {string} feed_id
 */
exports.remove = async(ctx, next) => {
    let user_id = ctx.state.user.id,
        feed_id = ctx.params.id;
    let result = await UserFeedModel.find({
        user_id: user_id,
        feed_id: feed_id
    }).remove();
    if (result.result.n === 0) {
        ctx.throw(404, '你没有订阅该订阅源');
    } else {
        setTimeout(async() => {
            await FeedModel.update({
                _id: feed_id
            }, {
                $inc: {
                    feedNum: -1
                }
            });
        }, 0);
        return ctx.body = {
            success: true,
            data: `取消订阅成功`
        };
    }
}
