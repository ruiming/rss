import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserPostModel from '../models/userPost'
import FeedParser from 'feedparser';
import request from 'request';
import _ from 'underscore';

/**
 * 这里主要是用户操作一个订阅源下面的文章的接口
 */

/**
 * 获取订阅源的文章摘要
 * @method: get
 * @url:    /api/feed/{feed_id}/post
 * @params: {string} feed_id
 */
exports.listAll = async (ctx, next) => {
    let feed_id = ctx.params.feed_id, user_id = ctx.state.user.id, result, detail;
    await Promise.all([Promise.resolve().then(async () => result = await PostModel.find({feed_id: feed_id}, {description: 0, summary: 0})),
            Promise.resolve().then(async() => detail = await UserPostModel.find({feed_id: feed_id, user_id: user_id}, {user_id: 0, feed_id: 0}))]);
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
    let feed_id = ctx.params.feed_id, id = ctx.params.id, user_id = ctx.state.user.id, result, readresult;
    await Promise.all([Promise.resolve().then(async () => result = await PostModel.findOne({_id: id, feed_id: feed_id})),
            Promise.resolve().then(async () => readresult = await UserPostModel.findOne({feed_id: feed_id, post_id: id, user_id: user_id}))]);
    if(result && result._id) {
        return ctx.body = { success: true, data: { result: result, detail: readresult } };
    } else {
        ctx.throw(404, result);
    }
}

/**
 * 更新文章状态
 * @method: put
 * @url:    /api/feed/{feed_id}/post/{id}
 * @params: {string} feed_id
 * @params: {string} id
 * @params: {read|mark|love|finish} type
 * @params: {boolean true|false} revert
 * @Important: 当 id 为 0 时表示更新该订阅源下的全部文章状态
 * @Important: 已读分两种情况, read 和 finish
 */
exports.update = async (ctx, next) => {
    let feed_id = ctx.params.feed_id, id = ctx.params.id, user_id = ctx.state.user.id,
        type = ctx.request.body.type && ctx.request.body.type.trim(), revert = ctx.request.body.revert == true;
    if(['read', 'mark', 'love', 'finish'].indexOf(type) === -1) {
        ctx.throw(404, '参数非法');
    } else {
        setTimeout(async () => {
            let items = [];
            await new Promise(async (resolve, reject) => {
                if(id == 0) {
                    let post = await PostModel.find({feed_id: feed_id}, {_id: 1});
                    items = _.pluck(post, '_id');
                    resolve(items);
                } else {
                    items = [id];
                    resolve(items);
                }
            });
            for(let item of items) {
                let state = await UserPostModel.findOne({user_id: user_id, feed_id: feed_id, post_id: item});
                let basic = {user_id: user_id, feed_id: feed_id, post_id: item};
                switch(type) {
                    // 真已读
                    case 'finish': 
                        if(state && state._id) {
                            state['finish'] = state['read'] = true;
                            state['finish_date'] = Date.now();
                            state.save();    
                        } else {
                            state = new UserPostModel(Object.assign(basic, {finish: true, read: true, finish_date: Date.now()}));
                            state.save();
                        }
                        break;
                    // 标记已读，可反
                    case 'read':
                        if(state && state._id) {
                            state['read'] = revert ? !state['read'] : true;
                            if(!revert) state['read_date'] = Date.now();
                            state.save();    
                        } else {
                            state = new UserPostModel(Object.assign(basic, {read: true}));
                            state.save();
                        }
                        break;
                    case 'mark':
                        if(state && state._id) {
                            state['mark'] = revert ? !state['mark'] : true;
                            if(!revert) state['mark_date'] = Date.now();
                            state.save();
                        } else {
                            state = new UserPostModel(Object.assign(basic, {mark: true, mark_date: Date.now()}));
                            state.save();
                        }
                        break;
                    case 'love':
                        if(state && state._id) {
                            state['love'] = revert ? !state['love'] : true;
                            if(!revert) state['love_date'] = Date.now();
                            state.save();
                        }  else {
                            state = new UserPostModel(Object.assign(basic, {love: true, love_date: Date.now()}));
                        }
                        break;
                    default:
                        break;
                }
            }
        }, 0);
        ctx.body = { success: true, data: '操作成功' };
    }
}
