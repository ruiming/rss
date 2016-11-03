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
        Promise.resolve().then(async() => await PostModel.findOne({
            _id: id
        }).lean().exec((err, data) => {
            data.feed_id = data.feed_id[0]
            return result = data
        })),
        Promise.resolve().then(async() => readresult = await UserPostModel.findOne({
            post_id: id,
            user_id: user_id
        }))
    ])
    if (result && result._id) {
        let posts = await PostModel.find({
            feed_id: result.feed_id
        }, {
            _id: 1
        }).sort({
            pubdate: -1
        })
        posts = _.invoke(_.flatten(_.pluck(posts, '_id'), true), 'toString')
        let pre = posts[posts.indexOf(id) - 1],
            next = posts[posts.indexOf(id) + 1]
        ctx.body = {
            success: true,
            data:    {
                result: result,
                detail: readresult,
                pre:    pre,
                next:   next
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
