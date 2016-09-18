import FeedModel from '../models/feed';
import PostModel from '../models/post';

import FeedParser from 'feedparser';
import request from 'request';

// 增加新的订阅源
exports.create = async (ctx, next) => {
    var url = ctx.request.body.feedlink;

    var req = request(url), feedparser = new FeedParser();
    var data = [];
    var result, _id;
    var feed = new FeedModel();

    // 先查找数据库是否存在该订阅源
    var result = await FeedModel.find({absurl: url});

    if(result.length) {
        return ctx.body = {
            status: 'success',
            message: '订阅成功'
        };
    }

    req.on('err', err => ctx.body = err);
    req.on('response', function(res) {
        if(res.statusCode != 200)   return this.emit('error', new Error('Bad Status code'));
        res.pipe(feedparser);
    });
    feedparser.on('meta', async function() {
        var feed = new FeedModel(Object.assign(this.meta, {absurl: url}));
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
                status: 'success',
                message: '订阅成功'
            }
            resolve();
        });
    });
}

exports.get = async(ctx, next) => {
    var rid = ctx.params.rid;
    var result = await FeedModel.find({rid: rid});
    if(!result) {
         ctx.body = "error";
    } else {
        ctx.body = result;
    }
}
