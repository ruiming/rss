import FeedModel from '../models/feed';
import PostModel from '../models/post';

import FeedParser from 'feedparser';
import request from 'request';

// 增加新的订阅源
exports.create = async (ctx, next) => {

    var url = 'http://www.alloyteam.com/feed/';
    var req = request(url), feedparser = new FeedParser();
    var data = [];
    var result, _id;
    var feed = new FeedModel();

    // 先查找数据库是否存在该订阅源
    var result = await FeedModel.find({xmlurl: url});
    if(result.length) {
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
        await feedparser.on('readable', function() {
            while(result = this.read()) {
                var post = new PostModel(Object.assign(result, {feed_id: _id}));
                post.save();
            }
        });
    });
    await feedparser.on('end', function() {
        return ctx.body = '123';
    });


    /*
    var info = {
        rid: 123,
        title: '1213123'
    }
    var feed = new FeedModel(info);
    var result = await feed.save();
    console.log(result);
    if(!result) {
        ctx.body = "error";
    } else {
        ctx.body = result;
    }
    */
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
