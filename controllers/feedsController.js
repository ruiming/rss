import FeedModel from '../models/feed';
import _ from 'underscore';

/**
 * 获取特定订阅源
 * @method: get
 * @url:    /api/feeds
 * @query:  {string} order
 * @query:  {string} desc
 * @query:  {string} limit
 * @query:  {string} page
 * @query:  {string} per_page
 */

exports.list = async (ctx, next) => {
    let user_id = ctx.state.user.id,
        order = ctx.request.query.order,
        limit = +ctx.request.query.limit,
        page = +ctx.request.query.page,
        per_page = +ctx.request.query.per_page,
        desc = ctx.request.query.desc === 'true' ? '1' : '-1',
        result = await FeedModel.find().sort({[order]: desc}).skip(page*per_page).limit(per_page || limit);
    ctx.body = { success: true, data: result };
}
