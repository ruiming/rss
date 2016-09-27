import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserFeedModel from '../models/userFeed'
import FeedParser from 'feedparser';
import request from 'request';
import help from '../helper/help';
import fetchFavicon from 'favicon-getter';
import config from '../config/config';
import mongoose from 'mongoose';

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);
mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');
/**
 * 定时更新订阅源
 */
async function update() {
    var items = await FeedModel.find({},{absurl: 1, _id: 1});
    let promises = items.map(item => {
        return new Promise((resolve, reject) => {
            let req = request(item.absurl);
            let feedparser = new FeedParser();
            req.on('response', res => {
                if(res.statusCode != 200) {
                    reject(err);
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
            feedparser.on('readable', async function() {
                let result;
                while(result = this.read()) {
                    let origin = await PostModel.findOne({pubdate: result.pubdate, feed_id: item._id});
                    if(origin && origin._id) {
                        Object.assign(origin, result);
                        origin.save();
                        console.log('update: ' + result.title);
                    } else {
                        let post = new PostModel(Object.assign(result, {feed_id: item._id}));
                        post.save();
                        UserFeedModel.update({feed_id: item._id}, {recent_update: Date.now(), $inc: {unread: 1}});
                        console.log('new: ' + result.title);
                    }
                }
            });
        });
    })
    Promise.all(promises).then(data => {
        console.log('done');
    }).catch(err => {
        console.log(err);
    })
}
update();