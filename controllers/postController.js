import _ from 'underscore'
import PostModel from '../models/post'
import UserPostModel from '../models/userPost'

/**
 * 获取一篇文章的详细信息
 * @method: get
 * @link:   /api/post/{id}
 * @date: 2017.1.10
 */
exports.listOne = async (ctx, next) => {
  const id = ctx.params.id
  const user_id = ctx.state.user.id
  let result
  let readresult
  await Promise.all([
    PostModel.findOne({
      _id: id,
    }, {
      summary: 0,
      guid:    0,
    }).populate('feed_id', {
      favicon: 1,
      _id:     1,
      link:    1,
    }).lean().exec(),
    UserPostModel.findOne({
      post_id: id,
      user_id,
    }).lean().exec(),
  ]).then(res => {
    [result, readresult] = res
    result = {
      ...result,
      feed_id: result.feed_id[0]._id,
      favicon: result.feed_id[0].favicon,
      website: result.feed_id[0].link,
      read:    !!readresult && readresult.read === true,
      love:    !!readresult && readresult.love === true,
      mark:    !!readresult && readresult.mark === true,
    }
  })
  if (result && result._id) {
    let posts = []
    let readposts = []
    await Promise.all([
      PostModel.find({
        feed_id: result.feed_id,
      }).sort({
        pubdate: -1,
      }).lean().exec((err, data) => posts = data.map(item => {
        item._id = item._id.toString()
        return item
      })),
      UserPostModel.find({
        user_id,
        feed_id: result.feed_id,
        read:    true,
      }, {
        _id:     0,
        post_id: 1,
      }).sort({
        pubdate: -1,
      }).lean().exec((err, data) => {
        readposts = _.invoke(_.flatten(_.pluck(data, 'post_id')), 'toString')
      }),
    ])
    const prePost = posts[_.pluck(posts, '_id').indexOf(id) - 1] && posts[_.pluck(posts, '_id').indexOf(id) - 1]._id
    const nextPost = posts[_.pluck(posts, '_id').indexOf(id) + 1] && posts[_.pluck(posts, '_id').indexOf(id) + 1]._id
    // 全部文章 ID 中遍历找出一个不等于所要查找 ID 且不在 readposts 中的第一个 ID
    const nextunread = _.findWhere(posts, {
      _id: _.find(_.pluck(posts, '_id'), post => post !== id && !readposts.includes(post)),
    })
    ctx.body = {
      success: true,
      data:    {
        ...result,
        pre:        prePost,
        next:       nextPost,
        nextunread: nextunread && {
          feed_id:     nextunread.feed_id && nextunread.feed_id[0],
          _id:         nextunread._id,
          title:       nextunread.title,
          description: nextunread.description && nextunread.description.replace(/<[^>]+>/g, '').slice(0, 400),
          pubdate:     nextunread.pubdate,
        },
      },
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
exports.update = async (ctx, next) => {
  const id = ctx.params.id
  const user_id = ctx.state.user.id
  const type = ctx.request.body.type && ctx.request.body.type.trim()
  const revert = ctx.request.body.revert === true
  if (!['read', 'mark', 'love', 'finish'].includes(type)) {
    ctx.throw(404, '参数非法')
  } else {
    setTimeout(async () => {
      const items = id.split(',')
      for (const item of items) {
        let state
        let res
        await Promise.all([
          UserPostModel.findOne({
            user_id,
            post_id: item,
          }),
          PostModel.findById(item),
        ]).then(result => {
          [state, res] = result
        }).catch(e => e)
        if (!(res && res._id)) {
          continue
        }
        let basic = {
          user_id,
          feed_id: res.feed_id,
          post_id: item,
        }
        if (state && state._id) {
          state[type] = revert ? !state[type] : true
          if (!revert) { state[`${type}_date`] = Date.now() }
          state.save()
        } else {
          basic[type] = true
          basic[`${type}_date`] = Date.now()
          basic = new UserPostModel(basic)
          basic.save()
        }
      }
    }, 0)
    ctx.body = {
      success: true,
      data:    '操作成功',
    }
  }
}
