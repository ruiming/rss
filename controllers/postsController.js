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
 * @params: {string unread|mark} type
 */
exports.list = async (ctx, next) => {
    var user_id = ctx.state.user.id;
    var feeds = await UserFeedModel.find({user_id: user_id}, {feed_id: 1, unread: 1});
    var posts = [];
    await Promise.all(feeds.map(feed => new Promise(async (resolve, reject) => {
        if(feed.unread) {
            var read = await UserPostModel.find({feed_id: feed.feed_id, user_id: user_id, read: true}, {_id: 0, post_id: 1});
            var data = _.invoke(_.flatten(_.pluck(read, 'post_id'), true), 'toString');
            var items = await PostModel.find({feed_id: feed.feed_id}, {summary: 0, description: 0});
            _.each(items, item => !_.contains(data, item._id.toString()) ? posts.push(item) : _.noop());
            resolve();
        } else {
            resolve();
        }
    })));
    ctx.body = { success: true, data: posts };
}
