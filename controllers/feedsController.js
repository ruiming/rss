import FeedModel from '../models/feed'

/**
 * 获取特定订阅源
 * @method: get
 * @link:   /api/feeds
 * @param:  order
 * @param:  desc
 * @param:  limit
 * @param:  page
 * @param:  per_page
 * @date: 2017.1.10
 */

exports.list = async (ctx, next) => {
  const { order, limit, page, per_page, desc } = ctx.request.query
  const result = await FeedModel.find().sort({
    [order]: desc === 'true' ? '1' : '-1',
  })
  .skip(+page * +per_page)
  .limit(+per_page || +limit)
  ctx.body = {
    success: true,
    data:    result,
  }
}
