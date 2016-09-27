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

/**
 * 更新全部未读文章
 * @method: post
 * @url:    /api/posts
 * @params: {string | array} id
 */
exports.update = async (ctx, next) => {
    var ids = ctx.params.id, user_id = ctx.state.user.id,
        type = ctx.request.body.type && ctx.request.body.type.trim(), revert = ctx.request.body.revert == true;
    ids = ids.split(',');
    _.each(ids, id => {
        setTimeout(async () => {
            var state = await UserPostModel.findOne({user_id: user_id, post_id: id});
            if(state && stat._id) {
                state = true;
                state.save();
            } else {
                var feed = await PostModel.findOne({_id: id}, {_id: 1});
                if(feed && feed_id) {
                    state = {user_id: user_id, feed_id: feed_id, post_id: id};
                    state = new UserPostModel(state);
                    state.save();
                }
            }
        }, 0);
    });
}
