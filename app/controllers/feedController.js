import FeedModel from '../models/feed';
import PostModel from '../models/post';

import FeedParser from 'feedparser';
import request from 'request';

// 增加新的订阅源
exports.create = (ctx, next) => {
    var url = ctx.body.feedlink;
    var req = request(url), feedparser = new FeedParser();
    var data = [];
    var result, _id;
    var feed = new FeedModel();

    // 先查找数据库是否存在该订阅源
    var result = await FeedModel.find({xmlurl: url});
    if(result.length) {
        // TODO: 订阅源已经存在
        console.log('exist');
    }

    req.on('err', err => ctx.body = err);
    req.on('response', function(res) {
        if(res.statusCode != 200)   return this.emit('error', new Error('Bad Status code'));
        res.pipe(feedparser);
    });
    feedparser.on('meta', async function() {
        var feed = new FeedModel(this);
        var store = await feed.save();
        _id = store._id;
        feedparser.on('readable', function() {
            while(result = this.read()) {
                console.log(_id);
                var post = new PostModel(Object.assign(result, {feed_id: _id}));
                post.save();
            }
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
