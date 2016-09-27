import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserPostModel from '../models/userPost';
import UserFeedModel from '../models/userFeed';
import FeedParser from 'feedparser';
import request from 'request';
import _ from 'underscore';


/**
 * 获取全部未读文章
 * @method: get
 * @url:    /api/posts
 * @params: {string} type
 * @return: Array
 */
exports.list = async (ctx, next) => {
    var user_id = ctx.state.user.id;
    var feeds = await UserFeedModel.find({user_id: user_id}, {feed_id: 1, unread: 1});
    var posts = [];
    await Promise.all(feeds.map(feed => new Promise(async (resolve) => {
        if(feed.unread) {
            var result = await PostModel.find({feed_id: feed.feed_id}, {summary: 0, description: 0}).limit(feed.unread);
            posts.push(result);
            resolve();
        } else {
            resolve();
        }
    })));
    ctx.body = posts;
}
