import FeedModel from '../models/feed';
import PostModel from '../models/post';
import UserPostModel from '../models/userPost'
import FeedParser from 'feedparser';
import request from 'request';


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
    var result = await PostModel.findOne({_id: id, feed_id: feed_id}).catch(e => e);
    if(result) {
        // 文章标记为已读
        setTimeout(async () => {
            var read = await UserPostModel.findOne({user_id: userid, feed_id: feed_id, post_id: id});
            if(read && read._id) {
                return;
            } else {
                read = new UserPostModel({user_id: userid, feed_id: feed_id, post_id: id, read: true});
                read.save();
            }
        }, 0);
        ctx.body = { success: true, data: result };
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
 */
exports.update = async (ctx, next) => {
    var feed_id = ctx.params.feed_id, id = ctx.params.id;
    var userid = ctx.state.user.id;
    var type = ctx.request.body.type.trim();
    if(['read', 'mark', 'love'].indexOf(type) === -1) {
        ctx.throw('参数错误');
    } else {
        setTimeout(async () => {
            var state = await UserPostModel.findOne({user_id: userid, feed_id: feed_id, post_id: id});
            if(state && state._id) {
                state[type] = !state[type];
                state.save()
            } else {
                state = {user_id: userid, feed_id: feed_id, post_id: id};
                state[type] = true;
                state = new UserPostModel(state);
                state.save();
            }
        }, 0);
        ctx.body = { success: true, data: '操作成功' };
    }
}