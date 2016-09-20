import FeedModel from '../models/feed';
import PostModel from '../models/post';

import FeedParser from 'feedparser';
import request from 'request';

// TODO: 数据库错误捕捉处理

/**
 * 创建/新增订阅源
 * @method: post
 * @url:    /api/feed
 * @params: {string} feedlink
 */
exports.create = async (ctx, next) => {
    var feedlink = ctx.request.body.feedlink.trim();

    var feedparser = new FeedParser(), feed = new FeedModel(), _id;

    var result = await FeedModel.findOne({absurl: feedlink});

    if(result) {
        result.feeder += 1;
        result.save();
        return ctx.body = { success: true, data: {id: result._id} };
    }

    await new Promise((resolve, reject) => {
        var req = request(feedlink, err => {
            reject(err);
        });
        req.on('response', function(res) {
            if(res.statusCode != 200) {
                reject(res.statusCode);
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

        feedparser.on('meta', async function() {
            var feed = new FeedModel(Object.assign(this.meta, {absurl: feedlink}));
            var store = await feed.save();
            _id = store._id;
            feedparser.on('readable', function() {
                while(result = this.read()) {
                    var post = new PostModel(Object.assign(result, {feed_id: _id}));
                    post.save();
                }
                ctx.body = { success: true, data: {id: _id} };
                resolve();
            });
        });
    });
}

/**
 * 获取订阅源信息
 * @method: get
 * @url:    /api/feed/{id}
 * @params: {string} id
 */
exports.list = async (ctx, next) => {
    var id = ctx.params.id;
    var result = await FeedModel.findById(id).catch(e => e);
    if (result._id) {
        ctx.body = { success: true, data: result };
    } else {
        ctx.throw(result);
    }
}

/**
 * 获取全部订阅源
 * @method: get
 * @url:    /api/feed
 * TODO:    根据用户获取
 */
exports.listAll = async (ctx, next) => {
    var result = await FeedModel.find();
    ctx.body = { success: true, data: result };
}
