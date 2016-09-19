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
    try {
        var feedlink = ctx.request.body.feedlink;

        var feedparser = new FeedParser(), feed = new FeedModel(), _id;

        var result = await FeedModel.findOne({absurl: feedlink});
        
        if(result) {
            result.feeder += 1;
            result.save();
            return ctx.body = { success: true, data: {id: result._id} };
        }

        await new Promise((resolve, reject) => {
            // 检查 feedlink 是否有效
            var req = request(feedlink, err => {
                reject(err);
            });
            req.on('response', function(res) {
                if(res.statusCode != 200) {
                    reject(res.statusCode);
                } else {
                    // TODO make sure res is a rss
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
                });
            });
        });

    } catch (error) {
        ctx.body = { success: false, message: error.toString()};
        ctx.status = 400;
    }
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
        ctx.body = { success: true, data: result };
    } else {
        ctx.throw(400, JSON.stringify({success: false, message: '订阅源不存在', error: result}));
    }
}

/**
 * 获取指定订阅源的文章
 * @method: get
 * @url:    /api/feedlink/{id}/post
 * @params: {string} id
 * @query:  {number} limit
 * @query:  {number} page
 * @query:  {number} per_page
 */
exports.listPost = async (ctx, next) => {
    var id = ctx.params.id, limit = ctx.request.query.limit || ctx.request.query.per_page || 2, page = ctx.request.query.page || 0;
    var result = await PostModel.where('feed_id').eq(id).skip(+page*limit).limit(+limit).catch(e => e);
    if(result[0] && result[0]._id) {
        ctx.body = { success: true, data: result };
    } else {
        ctx.throw(400, JSON.stringify({success: false, message: '订阅源不存在', error: result}));
    }
}
