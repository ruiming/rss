import FeedModel from '../models/feed';
import PostModel from '../models/post';

import FeedParser from 'feedparser';
import request from 'request';

/**
 * 创建/新增订阅源
 * @method: post
 * @url:    /api/feed/create
 * @params: {string} feedlink
 */
exports.create = async (ctx, next) => {
    var feedlink = ctx.request.body.feedlink;

    var req = request(feedlink), feedparser = new FeedParser(), feed = new FeedModel(), _id;

    // 先查找数据库是否存在该订阅源
    var result = await FeedModel.find({absurl: feedlink});
    if(result.length) {
        return ctx.body = {
            success: true,
            data: {id: result[0]._id}
        };
    }

    // 如果 feedlink 参数不正确，会在这里报错
    req.on('err', err => ctx.body = err);
    req.on('response', function(res) {
        // TODO: this.emit ?
        if(res.statusCode != 200)   return this.emit('error', new Error('Bad Status code'));
        res.pipe(feedparser);
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
        });
    });
    await new Promise(resolve => {
        feedparser.on('end', () => {
            ctx.body = {
                success: true,
                data: {id: _id}
            }
            resolve();
        });
    });
}

/**
 * 获取订阅源信息
 * @method: get
 * @url:    /api/feedlink/{id}
 * @params: {string} id
 */
exports.list = async (ctx, next) => {
    var id = ctx.params.id;
    var result = await FeedModel.findById(id).catch(e => e);
    if (result._id) {
        ctx.body = {
            success: true,
            data: result
        }
    } else {
        ctx.throw(400, JSON.stringify({success: false, message: '订阅源不存在', error: result}))
    }
}
