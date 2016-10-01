import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserPostModel from '../models/userPost';
import UserFeedModel from '../models/userFeed';
import FeedParser from 'feedparser';
import request from 'request';
import _ from 'underscore';

/**
 * 这里主要是用户全部文章操作的接口
 */


/**
 * 获取全部 ** 文章
 * @method: get
 * @url:    /api/posts
 * @params: {string unread|mark} type
 */
exports.list = async (ctx, next) => {
    var user_id = ctx.state.user.id, type = ctx.request.query.type;
    if(['mark', 'unread'].indexOf(type) === -1) {
        ctx.throw(404, '不支持的查询类型');
    } else {
        var feeds = await UserFeedModel.find({user_id: user_id}, {feed_id: 1});
        var posts = [];
        await Promise.all(feeds.map(feed => new Promise(async (resolve, reject) => {
            var query = {feed_id: feed.feed_id[0], user_id: user_id};
            type === 'mark' ? query['mark'] = true : query['read'] = true;
            var result = await UserPostModel.find(query, {_id: 0, post_id: 1});
            var data = _.invoke(_.flatten(_.pluck(result, 'post_id'), true), 'toString');
            var items = await PostModel.find({feed_id: feed.feed_id}, {summary: 0, description: 0}).populate('feed_id', {_id: 1, title: 1, favicon: 1});
            if(type === 'mark') _.each(items, item => _.contains(data, item._id.toString()) ? posts.push(item) : _.noop());
            else _.each(items, item => !_.contains(data, item._id.toString()) ? posts.push(item) : _.noop());
            resolve();
        })));
        ctx.body = { success: true, data: posts };
    }

}

/**
 * 最近更新的未读的文章
 * @method: get
 * @url:    /api/posts/recent
 */
exports.main = async (ctx, next) => {
    var user_id = ctx.state.user.id;
    var items = await UserFeedModel.find({user_id: user_id}, {user_id: 0})
        .populate('feed_id', {favicon: 1, title: 1}).lean().exec((err, items) => {
            Promise.all(_.map(items, item => new Promise(async (resolve, reject) => {
                var userposts = await UserPostModel.find({feed_id: item.feed_id, user_id: user_id, read: true});
                await PostModel.find({feed_id: item.feed_id}).lean().exec((err, posts) => {
                    var count = posts.length - userposts.length,
                    read_ids = _.invoke(_.pluck(userposts, 'post_id'), 'toString');
                    for(let post of posts) {
                        if(read_ids.indexOf(post._id.toString()) === -1) {
                            post.summary = post.description.replace(/<[^>]+>/g,"").slice(0, 550);
                            post.description = post.description.match(/<img\s+src="(.*?)"/);
                            // 图片处理
                            if(post.description) {
                                if(post.description[1].slice(0, 2) !== '//' && post.description[1].slice(0, 2) !== 'ht') {
                                    post.description = post.website + post.description[1];
                                } else {
                                    post.description = post.description[1];
                                }
                            }
                            else   post.description = '/img/noimg.png';
                            resolve(Object.assign(item, post, {unread: count}));
                            break;
                        }
                    }
                    resolve();
                })
            }))).then(items => {
                ctx.body = { success: true, data: items };
            });
        });
}

/**
 * 更新全部未读文章
 * @method: post
 * @url:    /api/posts
 */
exports.update = async (ctx, next) => {
    var ids = ctx.request.body.id, user_id = ctx.state.user.id;
    ids = ids.split(',');
    console.log(user_id);
    UserFeedModel.update({user_id: user_id}, {$set: {unread: 0}}, {multi: true}).exec();
    _.each(ids, id => {
        setTimeout(async () => {
            var state = await UserPostModel.findOne({user_id: user_id, post_id: id});
            var feed = await PostModel.findOne({_id: id}, {_id: 1, feed_id: 1});
            if(state && state._id) {
                state.read = true;
                state.save();
            } else {
                if(feed && feed._id) {
                    state = {user_id: user_id, feed_id: feed.feed_id, post_id: id, read: true};
                    state = new UserPostModel(state);
                    state.save();
                }
            }
        }, 0);
    });
    ctx.body = { success: true, data: '操作成功' };
}
