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
    let user_id = ctx.state.user.id, type = ctx.request.query.type;
    if(['mark', 'unread'].includes(type)) {
        let feeds = await UserFeedModel.find({user_id: user_id}, {feed_id: 1}), posts = [];
        await Promise.all(feeds.map(feed => new Promise(async (resolve, reject) => {
            let query = {feed_id: feed.feed_id[0], user_id: user_id};
            type === 'mark' ? query['mark'] = true : query['read'] = true;
            let result = await UserPostModel.find(query, {_id: 0, post_id: 1});
            let data = _.invoke(_.flatten(_.pluck(result, 'post_id'), true), 'toString');
            let items = await PostModel.find({feed_id: feed.feed_id}, {summary: 0, description: 0}).populate('feed_id', {_id: 1, title: 1, favicon: 1});
            if(type === 'mark') _.each(items, item => _.contains(data, item._id.toString()) ? posts.push(item) : _.noop());
            else _.each(items, item => !_.contains(data, item._id.toString()) ? posts.push(item) : _.noop());
            resolve();
        })));
        ctx.body = { success: true, data: posts };
    } else {
        ctx.throw(404, '不支持的类型查询');
    }

}

/**
 * 最近更新的未读的文章
 * @method: get
 * @url:    /api/posts/recent
 */
exports.main = async (ctx, next) => {
    let user_id = ctx.state.user.id;
    await UserFeedModel.find({user_id: user_id}, {user_id: 0})
        .populate('feed_id', {favicon: 1, title: 1}).lean().exec((err, items) => {
            return Promise.all(_.map(items, item => new Promise(async (resolve, reject) => {
                let userposts = await UserPostModel.find({feed_id: item.feed_id, user_id: user_id, read: true});
                await PostModel.find({feed_id: item.feed_id}).lean().exec((err, posts) => {
                    let count = posts.length - userposts.length,
                    read_ids = _.invoke(_.pluck(userposts, 'post_id'), 'toString');
                    for(let post of posts) {
                        if(!read_ids.includes(post._id.toString())) {
                            post.summary = post.description.replace(/<[^>]+>/g,"").slice(0, 550);
                            post.description = post.description.match(/<img\s+src="(.*?)"/);
                            if(post.description) {
                                if(post.description[1].slice(0, 2) !== '//' && post.description[1].slice(0, 2) !== 'ht') {
                                    post.description = post.website + post.description[1];
                                } else {
                                    post.description = post.description[1];
                                }
                            } else {
                                post.description = '/img/noimg.png';
                            }
                            resolve(Object.assign(post, item, {_id: post._id, unread: count}));
                            break;
                        }
                    }
                    resolve([]);
                })
            }))).then(items => {
                ctx.body = { success: true, data: _.filter(items, item => item.length !== 0) };
            }).catch(e => e);
        });
}

/**
 * 更新全部未读文章
 * @method: post
 * @url:    /api/posts
 */
exports.update = async (ctx, next) => {
    let ids = ctx.request.body.id.split(','), user_id = ctx.state.user.id, state, feed;
    UserFeedModel.update({user_id: user_id}, {$set: {unread: 0}}, {multi: true}).exec();
    _.each(ids, id => {
        setTimeout(async () => {
            await Promise.all([Promise.resolve().then(async () => state = await UserPostModel.findOne({user_id: user_id, post_id: id})),
                    Promise.resolve().then(async () => feed = await PostModel.findOne({_id: id}, {_id: 1, feed_id: 1}))]);
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
