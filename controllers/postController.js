import PostModel from '../models/post'
import UserPostModel from '../models/userPost'
import _ from 'underscore'

/**
 * 获取一篇文章的详细信息
 * @method: get
 * @link:   /api/post/{id}
 */
exports.listOne = async(ctx, next) => {
    let id = ctx.params.id,
        user_id = ctx.state.user.id,
        result, readresult
    await Promise.all([
        Promise.resolve().then(async() => result = await PostModel.findOne({
            _id: id
        }, {
            summary: 0,
            guid:    0
        }).populate('feed_id', {
            favicon: 1,
            _id:     1
        }).lean().exec()),
        Promise.resolve().then(async() => readresult = await UserPostModel.findOne({
            post_id: id,
            user_id: user_id
        }).lean().exec()),
    ]).then(() => {
        result = {
            ...result,
            feed_id: result.feed_id[0]._id,
            favicon: result.feed_id[0].favicon,
            read:    !!readresult && readresult.read === true,
            love:    !!readresult && readresult.love === true,
            mark:    !!readresult && readresult.mark === true
        }
    })
    if (result && result._id) {
        let posts = [], readposts = [], pre, next, nextunread
        await Promise.all([
            Promise.resolve().then(async () => await PostModel.find({
                feed_id: result.feed_id
            }).sort({
                pubdate: -1
            }).lean().exec((err, data) => {
                return posts = _.map(data, item => {
                    item._id = item._id.toString()
                    return item
                })
            })),
            Promise.resolve().then(async () => await UserPostModel.find({
                feed_id: result.feed_id,
                read:    true
            }, {
                _id:     0,
                post_id: 1
            }).sort({
                pubdate: -1
            }).lean().exec((err, data) => {
                readposts = _.invoke(_.flatten(_.pluck(data, 'post_id')), 'toString')
            }))
        ])
        pre = posts[_.pluck(posts, '_id').indexOf(id) - 1] && posts[_.pluck(posts, '_id').indexOf(id) - 1]._id
        next = posts[_.pluck(posts, '_id').indexOf(id) + 1] && posts[_.pluck(posts, '_id').indexOf(id) + 1]._id
        // 全部文章 ID 中遍历找出一个不等于所要查找 ID 且不在 readposts 中的第一个 ID
        nextunread = _.findWhere(posts, {
            _id: _.find(_.pluck(posts, '_id'), post => post !== id && !readposts.includes(post))
        })
        ctx.body = {
            success: true,
            data:    {
                ...result,
                pre,
                next,
                // 下一篇未读信息, 主要是首页未读文章缓存更新用
                nextunread: nextunread && {
                    feed_id:     nextunread.feed_id && nextunread.feed_id[0],
                    _id:         nextunread._id,
                    title:       nextunread.title,
                    description: nextunread.description && nextunread.description.replace(/<[^>]+>/g, '').slice(0, 400),
                    pubdate:     nextunread.pubdate
                }
            }
        }
    } else {
        ctx.throw(404, result)
    }
}

/**
 * 更新文章状态
 * @method: put
 * @link:   /api/post/{id}
 * @param:  {string} type [read|mark|love|finish]
 * @param:  {boolean} revert [true|false]
 */
exports.update = async(ctx, next) => {
    let id = ctx.params.id,
        user_id = ctx.state.user.id,
        type = ctx.request.body.type && ctx.request.body.type.trim(),
        revert = ctx.request.body.revert === true
    if (!['read', 'mark', 'love', 'finish'].includes(type)) {
        ctx.throw(404, '参数非法')
    } else {
        setTimeout(async() => {
            let items = id.split(',')
            for (let item of items) {
                let state, res
                await Promise.all([
                    Promise.resolve().then(async() => state = await UserPostModel.findOne({
                        user_id: user_id,
                        post_id: item
                    })),
                    Promise.resolve().then(async() => res = await PostModel.findById(item))
                ]).catch(e => e)
                if (!(res && res._id)) {
                    continue
                }
                let basic = {
                    user_id: user_id,
                    feed_id: res.feed_id,
                    post_id: item
                }
                if (state && state._id) {
                    state[type] = revert ? !state[type] : true
                    if (!revert) { state[type + '_date'] = Date.now() }
                    state.save()
                } else {
                    basic[type] = true
                    basic[type + '_date'] = Date.now()
                    basic = new UserPostModel(basic)
                    basic.save()
                }
            }
        }, 0)
        ctx.body = {
            success: true,
            data:    '操作成功'
        }
    }
}
