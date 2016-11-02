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
 */

exports.list = async(ctx, next) => {
    let { 
        order, 
        limit, 
        page, 
        per_page, 
        desc 
    } = ctx.request.query
    
    let result = await FeedModel.find()
        .sort({
            [order]: desc === 'true' ? '1' : '-1'
        })
        .skip(+page * +per_page)
        .limit(+per_page || +limit)

    ctx.body = {
        success: true,
        data: result
    }
}