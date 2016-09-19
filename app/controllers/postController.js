import FeedModel from '../models/feed';
import PostModel from '../models/post';

import FeedParser from 'feedparser';
import request from 'request';


/**
 * 获取指定订阅源的文章
 * @method: get
 * @url:    /api/feed/{feed_id}/post
 * @params: {string} feed_id
 * @query:  {number} limit
 * @query:  {number} page
 * @query:  {number} per_page
 * TODO:    去掉冗余信息
 */
exports.listAll = async (ctx, next) => {
    var feed_id = ctx.params.feed_id,
        limit = ctx.request.query.limit || ctx.request.query.per_page || 2, page = ctx.request.query.page || 0;
    var result = await PostModel.where('feed_id').eq(feed_id).skip(+page*limit).limit(+limit).catch(e => e);
    if(result[0] && result[0]._id) {
        ctx.body = { success: true, data: result };
    } else {
        ctx.throw(result);
    }
}

/**
 * 获取一篇文章的详细信息
 * @method: get
 * @url:    /api/feed/{feed_id}/post/id
 * @params: {string} feed_id
 * @params: {string} id
 */
exports.listOne = async (ctx, next) => {
    var feed_id = ctx.params.feed_id, id = ctx.params.id;
    var result = await PostModel.find({_id: id, feed_id: feed_id}).catch(e => e);
    if(result[0] && result[0]._id) {
        ctx.body = { success: true, data: result };
    } else {
        ctx.throw(result);
    }
}