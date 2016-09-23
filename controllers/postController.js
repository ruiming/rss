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
 * TODO:    
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
    // 文章标记为已读
    var read = new UserPostModel({user_id: userid, feed_id: feed_id, post_id: id});
    read.save();
    // 返回该文章结果
    var result = await PostModel.findOne({_id: id, feed_id: feed_id}).catch(e => e);
    if(result) {
        ctx.body = { success: true, data: result };
    } else {
        ctx.throw(result);
    }
}
