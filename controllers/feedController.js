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
 * 这里主要是订阅源管理的接口
 */

/**
 * 创建/订阅 订阅源
 * @method: post
 * @url:    /api/feed
 * @params: {string url} feedlink
 * @query:  {string true|false} search
 */
exports.create = async (ctx, next) => {
    var feedlink = ctx.request.body.feedlink && ctx.request.body.feedlink.trim();
    var search = ctx.request.query.search === 'true';
    if(!help.checkUrl(feedlink)) {
        ctx.throw(404, 'URL 不合法');
    }
    var user_id = ctx.state.user.id;
    var feedparser = new FeedParser(), feed = new FeedModel(), _id;
    // 查找数据库是否有该订阅源
    var result = await FeedModel.findOne({absurl: feedlink});
    // 判断数据库已存在该订阅源
    if(result && result._id) {
        if(search) {
            return ctx.body = { success: true, data: result._id };
        } else {
            var userresult = await UserFeedModel.findOne({user_id: user_id, feed_id: result._id});
            // 判断用户是否已经订阅该订阅源
            if(userresult && userresult._id) {
                ctx.throw(409, `已订阅源 ${result.title}(${result.id})`)
            } else {
                // 订阅源的订阅人数 +1
                result.feedNum += 1;
                result.save();
                var count = await PostModel.find({feed_id: result._id}).count();
                var userfeed = UserFeedModel({feed_id: result._id, user_id: user_id, unread: count});
                // 添加到用户订阅表
                userfeed.save();
                return ctx.body = { success: true, data: result };
            }
        }
    } else {
        await new Promise(async (resolve, reject) => {
            var req = request(feedlink);
            req.on('response', res => {
                if(res.statusCode != 200) {
                    reject('链接不可达');
                } else {
                    res.pipe(feedparser);
                    feedparser.on('error', err => {
                        if(err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
            req.on('error', err => reject(err));
            feedparser.on('meta', async function() {
                var favicon = null;
                await fetchFavicon(this.meta.link).then(data => favicon = data);
                await new Promise(resolve => request(favicon, (err, response, body) => {
                    if(response.statusCode != 200) {
                        favicon = '/img/rss.png';
                    }
                    resolve(favicon);
                }));
                var data = search ? {absurl: feedlink, favicon: favicon} : {absurl: feedlink, favicon: favicon, feedNum: 1};
                var feed = new FeedModel(Object.assign(this.meta, data, {lastScan: Date.now()}));
                var store = await feed.save();
                var feedid = store._id, link = store.link, count = 0;
                if(search) {
                    feedparser.on('readable', function() {
                        while(result = this.read()) {
                            var post = new PostModel(Object.assign(result, {feed_id: feedid, link: link}));
                            post.save();
                            count ++;
                        }
                    });
                    feedparser.on('end', function() {
                        ctx.body = { success: true, data: store._id };
                        resolve();
                    });
                } else {
                    setTimeout(() => {
                        feedparser.on('readable', function() {
                            while(result = this.read()) {
                                var post = new PostModel(Object.assign(result, {feed_id: feedid, link: link}));
                                post.save();
                                count ++;
                            }
                        });
                        feedparser.on('end', function() {
                            var userfeed = new UserFeedModel({feed_id: feedid, user_id: user_id, unread: count});
                            userfeed.save();
                        })
                    }, 0);
                    ctx.body = { success: true, data: store };
                    resolve();
                }
            });
        });
    }
}

/**
 * 获取 订阅源信息
 * @method: get
 * @url:    /api/feed/{id}
 * @params: {string} id
 */
exports.list = async (ctx, next) => {
    var id = ctx.params.id;
    var user_id = ctx.state.user.id;
    var unreadcount = await UserPostModel.count({feed_id: id, user_id: user_id, read: true});
    var count = await PostModel.count({feed_id: id});
    var result = await UserFeedModel.findOne({user_id: user_id, feed_id: id}, {user_id: 0}).populate('feed_id').lean()
        .exec((err, data) => data ? data.unread = count - unreadcount : data);
    if (result && result._id) {
        ctx.body = { success: true, data: result };
    } else {
        var result = await FeedModel.findOne({_id: id}).lean().exec((err, data) => data ? data.unread = count : data);
        if(result && result._id) {
            ctx.body = { success: true, data: result };
        } else {
            ctx.throw(404, '订阅源不存在');
        }
    }
}

/**
 * 获取 全部订阅源
 * @method: get
 * @url:    /api/feed
 */
exports.listAll = async (ctx, next) => {
    var user_id = ctx.state.user.id;
    var items = await UserFeedModel.find({user_id: user_id}, {user_id: 0})
        .populate('feed_id', {favicon: 1, title: 1}).lean().exec((err, items) => {
            Promise.all(_.map(items, item => new Promise(async (resolve, reject) => {
                var unreadcount = await UserPostModel.count({feed_id: item.feed_id, user_id: user_id, read: true});
                var count = await PostModel.count({feed_id: item.feed_id});
                resolve(Object.assign(item, {unread: count - unreadcount}));
            }))).then(items => {
                ctx.body = { success: true, data: items };
            });
        });
}

/**
 * 取消/删除 订阅源
 * @method: delete
 * @url:    /api/feed/{id}
 * @params: {string} id
 */
exports.remove = async (ctx, next) => {
    var user_id = ctx.state.user.id;
    var feed_id = ctx.params.id;
    var result = await UserFeedModel.find({user_id: user_id, feed_id: feed_id}).remove();
    if(result.result.n === 0) {
        ctx.throw(404, '你没有订阅该订阅源');
    } else {
        setTimeout(async () => {
            await FeedModel.update({_id: feed_id}, {$inc: {feedNum: -1}});
        }, 0);
        return ctx.body = { success: true, data: `取消订阅成功` };
    }
}
