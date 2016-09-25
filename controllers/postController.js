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
    var feed_id = ctx.params.feed_id;
    var userid = ctx.state.user.id;
    var result = await PostModel.find({feed_id: feed_id}, {description: 0, summary: 0});
    // 查询阅读情况
    var detail = await UserPostModel.find({feed_id: feed_id, user_id: userid}, {user_id: 0, feed_id: 0});
    if(result[0] && result[0]._id) {
        ctx.body = { success: true, data: { posts: result, detail: detail} };
    } else {
        ctx.throw(result);
    }
}

/**
 * 获取一篇文章的详细信息
 * @method: get
 * @url:    /api/feed/{feed_id}/post/{id}
 * @params: {string} feed_id
 * @params: {string} id
 */
exports.listOne = async (ctx, next) => {
    var feed_id = ctx.params.feed_id, id = ctx.params.id;
    var userid = ctx.state.user.id;
    // 返回该文章结果
    var result = await PostModel.findOne({_id: id, feed_id: feed_id});
    var readresult = await UserPostModel.findOne({feed_id: feed_id, post_id: id, user_id: userid});
    if(result) {
        ctx.body = { success: true, data: {result: result, detail: readresult} };
    } else {
        ctx.throw(result);
    }
}

/**
 * 更新文章状态
 * @method: put
 * @url:    /api/feed/{feed_id}/post/{id}
 * @params: {string} feed_id
 * @params: {string} id
 * @params: {read|mark|love} type
 * @params: {boolean} revert
 * @Important: 当 id 为 0 时表示更新全部文章状态
 * @Important: 已读分两种情况, read 和 finish
 */
exports.update = async (ctx, next) => {
    var feed_id = ctx.params.feed_id, id = ctx.params.id;
    var userid = ctx.state.user.id;
    var type = ctx.request.body.type && ctx.request.body.type.trim();
    var revert = ctx.request.body.revert === true;
    if(['read', 'mark', 'love', 'finish'].indexOf(type) === -1) {
        ctx.throw('参数错误');
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
            // Problem: 用户对一个订阅源标记全部已读会产生较多的数据库读写操作，并且有占用存储空间的可能
            for(let item of items) {
                var state = await UserPostModel.findOne({user_id: userid, feed_id: feed_id, post_id: item});
                if(type === 'finish')   state['read'] = true;                
                if(state && state._id) {
                    if(revert)  state[type] = !state[type];
                    else    state[type] = true;
                    state.save()
                } else {
                    state = {user_id: userid, feed_id: feed_id, post_id: item};
                    if(revert)  state[type] = false;
                    else    state[type] = true;
                    state = new UserPostModel(state);
                    state.save();
                }
            }
        }, 0);
        ctx.body = { success: true, data: '操作成功' };
    }
}
