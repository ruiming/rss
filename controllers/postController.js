import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserPostModel from '../models/userPost'
import FeedParser from 'feedparser';
import request from 'request';
import _ from 'underscore';


/**
 * 获取订阅源的文章摘要
 * @method: get
 * @url:    /api/feed/{feed_id}/post
 * @params: {string} feed_id
 */
exports.listAll = async (ctx, next) => {
    var feed_id = ctx.params.feed_id, user_id = ctx.state.user.id;
    var result = await PostModel.find({feed_id: feed_id}, {description: 0, summary: 0});
    var detail = await UserPostModel.find({feed_id: feed_id, user_id: user_id}, {user_id: 0, feed_id: 0});
    ctx.body = { success: true, data: { posts: result, detail: detail} };
}

/**
 * 获取一篇文章的详细信息
 * @method: get
 * @url:    /api/feed/{feed_id}/post/{id}
 * @params: {string} feed_id
 * @params: {string} id
 */
exports.listOne = async (ctx, next) => {
    var feed_id = ctx.params.feed_id, id = ctx.params.id, user_id = ctx.state.user.id;
    var result = await PostModel.findOne({_id: id, feed_id: feed_id});
    var readresult = await UserPostModel.findOne({feed_id: feed_id, post_id: id, user_id: user_id});
    result ? ctx.body = { success: true, data: {result: result, detail: readresult} } : ctx.throw(404, result);
}

/**
 * 更新文章状态
 * @method: put
 * @url:    /api/feed/{feed_id}/post/{id}
 * @params: {string} feed_id
 * @params: {string} id
 * @params: {read|mark|love} type
 * @params: {boolean true|false} revert
 * @Important: 当 id 为 0 时表示更新该订阅源下的全部文章状态
 * @Important: 已读分两种情况, read 和 finish
 */
exports.update = async (ctx, next) => {
    var feed_id = ctx.params.feed_id, id = ctx.params.id, user_id = ctx.state.user.id,
        type = ctx.request.body.type && ctx.request.body.type.trim(), revert = ctx.request.body.revert == true;
    if(['read', 'mark', 'love', 'finish'].indexOf(type) === -1) {
        ctx.throw(404, '参数非法');
    } else {
        setTimeout(async () => {
            var items = [];
            await new Promise(async (resolve, reject) => {
                if(id == 0) {
                    var post = await PostModel.find({feed_id: feed_id}, {_id: 1});
                    items = _.pluck(post, '_id');
                    resolve(items);
                } else {
                    items = [id];
                    resolve(items);
                }
            });
            for(let item of items) {
                var state = await UserPostModel.findOne({user_id: user_id, feed_id: feed_id, post_id: item});
                if(type === 'finish')   state['read'] = true;                
                if(state && state._id) {
                    state[type] = revert ? !state[type] : true;
                    state.save()
                } else {
                    state = {user_id: user_id, feed_id: feed_id, post_id: item};
                    state[type] = !revert;
                    state = new UserPostModel(state);
                    state.save();
                }
            }
        }, 0);
        ctx.body = { success: true, data: '操作成功' };
    }
}
