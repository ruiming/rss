import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserFeedModel from '../models/userFeed'
import FeedParser from 'feedparser';
import request from 'request';
import help from '../helper/help';
import fetchFavicon from 'favicon-getter';
import config from '../config/config';
import mongoose from 'mongoose';
import process from 'process';

mongoose.connect(`mongodb://${config.MongoDB.HOST}:${config.MongoDB.PORT}/${config.MongoDB.NAME}`);
mongoose.Promise = require('bluebird');
global.Promise = require('bluebird');
/**
 * 定时更新订阅源
 */
async function update() {
    var items = await FeedModel.find({},{absurl: 1, _id: 1});
    var starttime = Date.now(), updateCount=0, newCount=0, equalCount=0;
    let promises = items.map(item => {
        return new Promise((resolve, reject) => {
            let req = request({url: item.absurl, headers: {'User-Agent': 'request'}, timeout: 3000});
            let feedparser = new FeedParser();
            FeedModel.update({_id: item._id}, {recent_update: Date.now()});
            req.on('response', res => {
                if(res.statusCode != 200) {
                    console.log(`#1 ${res.statusCode} -- ${item.absurl}`);
                    resolve();
                } else {
                    res.pipe(feedparser);
                    feedparser.on('error', err => {
                        console.log(`#2 ${err} -- ${item.absurl}`);
                        resolve();
                    });
                }
            });
            req.on('error', err => {
                console.log(`#3 ${err} -- ${item.absurl}`);
                resolve();
            });
            feedparser.on('readable', async function() {
                let result;
                while(result = this.read()) {
                    let origin = await PostModel.findOne({pubdate: result.pubdate, feed_id: item._id});
                    if(origin && origin._id) {
                        if(origin.date.toString() == result.date.toString()) {
                            equalCount ++;
                        } else {
                            Object.assign(origin, result);
                            origin.save();
                            updateCount ++;
                        }
                    } else {
                        let post = new PostModel(Object.assign(result, {feed_id: item._id}));
                        newCount ++;
                        post.save();
                        UserFeedModel.update({feed_id: item._id}, {$inc: {unread: 1}});
                    }
                }
            });
            feedparser.on('end', function() {
                resolve();
            });
        });
    })
    Promise.all(promises).then(data => {
        setTimeout(() => {
            console.log('************* OK *************');
            console.log('FeedNum: ' + items.length);
            console.log('TimeUsed: ' + (Date.now() - starttime)/1000 + ' s');
            console.log('Equal: ' + equalCount);
            console.log('Update: ' + updateCount);
            console.log('New: ' + newCount);
            console.log('************* OK *************');
            process.exit();
        }, 100);
    }).catch(err => {
        console.log(err);
    });
}
update();
