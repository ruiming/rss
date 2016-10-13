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
 * 获取一篇文章的详细信息
 * @method: get
 * @link:   /api/post/{id}
 */
exports.listOne = async (ctx, next) => {
    let id = ctx.params.id, user_id = ctx.state.user.id, result, readresult;
    await Promise.all([Promise.resolve().then(async () => result = await PostModel.findOne({_id: id})),
            Promise.resolve().then(async () => readresult = await UserPostModel.findOne({post_id: id, user_id: user_id}))]);
    if(result && result._id) {
        return ctx.body = { success: true, data: { result: result, detail: readresult } };
    } else {
        ctx.throw(404, result);
    }
}

/**
 * 更新文章状态
 * 当更新一篇文章时，传入文章id即可，若更新全部文章，则传入文章的Feed_id并传入all=true参数
 * @method: put
 * @link:   /api/post/{id}
 * @param:  {string} type [read|mark|love|finish]
 * @param:  {string} revert [true|false]
 * @param:  {string} feed [true|false]
 */
exports.update = async (ctx, next) => {
    let id = ctx.params.id, user_id = ctx.state.user.id,
        type = ctx.request.body.type && ctx.request.body.type.trim(), revert = ctx.request.body.revert === 'true', feed = ctx.request.body.feed === 'true';
    if(!['read', 'mark', 'love', 'finish'].includes(type)) {
        ctx.throw(404, '参数非法');
    } else {
        setTimeout(async () => {
            let items = [];
            await new Promise(async (resolve) => {
                if(feed) {
                    let posts = await PostModel.find({feed_id: id}, {_id: 1});
                    resolve(_.pluck(posts, '_id'));
                } else {
                    resolve(id.split(','));
                }
            }).then(data => items = data);
            for(let item of items) {
                let state, res;
                await Promise.all([Promise.resolve().then(async () => state = await UserPostModel.findOne({user_id: user_id, post_id: item})),
                    Promise.resolve().then(async () => res = await PostModel.findById(item))]).catch(e => e);
                if(!(res && res._id))   continue;
                let basic = {user_id: user_id, feed_id: res.feed_id, post_id: item};
                if(state && state._id) {
                    state[type] = revert ? !state[type] : true;
                    if(!revert) state[type + '_date'] = Date.now();
                    state.save();
                } else {
                    basic[type] = true;
                    basic[type + '_date'] = Date.now();
                    basic = new UserPostModel(basic);
                    basic.save();
                }
            }
        }, 0);
        ctx.body = { success: true, data: '操作成功' };
    }
}
