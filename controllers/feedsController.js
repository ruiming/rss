import FeedModel from '../models/feed';
import _ from 'underscore';

/**
 * 获取特定订阅源
 * @method: get
 * @url:    /api/feeds
 * @query:  {string} type
 * @query:  {string} limit
 * @query:  {string} page
 * @query:  {string} per_page
 */

exports.list = async (ctx, next) => {
    let user_id = ctx.state.user.id,
        type = ctx.request.query.type,
        limit = +ctx.request.query.limit,
        page = +ctx.request.query.page,
        per_page = +ctx.request.per_page;
    let result = await FeedModel.find().sort(type).skip(page*per_page).limit(per_page || limit);
    ctx.body = result;
}
