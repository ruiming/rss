import _ from 'underscore'
import PostModel from '../models/post'
import UserPostModel from '../models/userPost'
import UserFeedModel from '../models/userFeed'

/**
 * 这里主要是用户全部文章操作的接口
 */


/**
 * 获取全部 ** 文章
 * @method: get
 * @link:   /api/posts
 * @param:  type [mark|unread]
 * @param:  feed_id
 * @date: 2017.1.10
 */
exports.list = async (ctx, next) => {
  const user_id = ctx.state.user.id
  const { type, feed_id, page, per_page } = ctx.request.query
  let result
  if (['mark', 'unread'].includes(type)) {
    await UserPostModel.find({
      [type]: true,
      user_id,
    }).populate('feed_id')
      .populate('post_id')
      .lean()
      .exec((err, items) => {
        result = items.map(item => ({
          mark:       item.mark,
          love:       item.love,
          _id:        item.post_id[0]._id,
          title:      item.post_id[0].title,
          feed_id:    item.feed_id[0]._id,
          feed_title: item.feed_id[0].title,
          favicon:    item.feed_id[0].favicon,
          pubdate:    item.post_id[0].pubdate,
        }))
      })
      .catch(e => e)
    ctx.body = {
      success: true,
      data:    result,
    }
  } else if (feed_id !== undefined) {
    await Promise.all([
      PostModel.find({
        feed_id,
      }, {
        description: 0,
        summary:     0,
      })
      .sort({
        pubdate: -1,
        _id:     -1,
      })
      .skip(+page * +per_page)
      .limit(+per_page)
      .lean()
      .exec((err, data) => data = data.map(item => {
        item.feed_id = item.feed_id[0]
        return item
      })),
      UserPostModel.find({
        feed_id,
        user_id,
      }, {
        user_id: 0,
        feed_id: 0,
      }).lean()
      .exec(),
    ]).then(items => {
      result = items[0].map(item => item = {
        ...items[1].filter(userpost => userpost.post_id[0].toString() === item._id.toString())[0],
        ...item,
        post_id: item._id,
      })
      ctx.body = {
        success: true,
        data:    result,
      }
    })
  } else {
    ctx.throw(404, '不支持的查询')
  }
}

/**
 * 最近更新的未读的文章
 * @method: get
 * @link:   /api/posts/recent
 * @date: 2017.1.10
 */
exports.main = async (ctx, next) => {
  const user_id = ctx.state.user.id
  let items
  let userposts
  let readlist
  // 查询用户订阅源
  await UserFeedModel.find({
    user_id,
  }, {
    user_id: 0,
  })
  .populate('feed_id', {
    favicon: 1,
    title:   1,
  }).lean().exec((err, data) => {
    items = data.map(item => {
      item.feed_title = item.feed_id[0].title
      item.favicon = item.feed_id[0].favicon
      item.feed_id = item.feed_id[0]._id
      return item
    })
  })
  await UserPostModel.find({
    feed_id: { $in: _.pluck(items, 'feed_id') },
    read:    true,
    user_id,
  }, {
    feed_id: 1,
    post_id: 1,
  }).lean().exec((err, rows) => {
    userposts = rows.map(row => {
      row.feed_id = row.feed_id.toString()
      row.post_id = row.post_id.toString()
      return row
    })
    readlist = _.pluck(userposts, 'post_id')
    userposts = _.groupBy(userposts, 'feed_id')
    items.forEach(item => {
      if (userposts[item.feed_id.toString()] === undefined) {
        userposts[item.feed_id.toString()] = []
      }
    })
  })
  await new Promise(resolve => PostModel.find({
    feed_id: { $in: Object.keys(userposts) },
    post_id: { $nin: readlist },
  }).lean().exec((err, posts) => {
    posts.forEach(post => post.feed_id = post.feed_id.toString())
    posts = _.groupBy(posts, 'feed_id')
    console.log(Object.keys(posts))
    posts = _.mapObject(posts, (currentFeedPosts, currentFeedId) => {
      const count = currentFeedPosts.length - userposts[currentFeedId].length
      const read_ids = userposts[currentFeedId].length === 0 ? [] : _.pluck(userposts[currentFeedId], 'post_id')
      const post = currentFeedPosts.reverse().find(p => read_ids.indexOf(p._id.toString()) === -1)
      if (post) {
        post.summary = post.description && post.description.replace(/<[^>]+>/g, '').slice(0, 550)
        post.description = post.description && post.description.match(/<img\s+src="(.*?)"/)
        if (post.description) {
          if (post.description[1].slice(0, 2) !== '//' && post.description[1].slice(0, 2) !== 'ht') {
            post.description = post.website + post.description[1]
          } else {
            post.description = post.description[1]
          }
        } else {
          post.description = '/img/noimg.png'
        }
        return {
          ...post,
          ...items.find(item => item.feed_id.toString() === currentFeedId),
          _id:    post._id,
          unread: count,
        }
      }
      return {}
    })
    ctx.body = {
      success: true,
      data:    Object.values(posts).filter(o => o._id),
    }
    resolve(posts)
  }))
}

/**
 * 更新全部未读文章
 * @method: put
 * @link:   /api/posts
 * @param:  {string} feed_id
 */
exports.update = async (ctx, next) => {
  if (ctx.request.body.feed_id === undefined || ctx.request.body.feed_id === null) {
    ctx.throw(404, '出错了')
  }
  // 电脑版有全部未读文章标记已读的接口，所以需要进行 split
  const ids = ctx.request.body.feed_id.split(',')
  const user_id = ctx.state.user.id
  ids.forEach(async id => {
    let posts = await PostModel.find({
      feed_id: id,
    }).sort('date')
    posts = posts.map(value => value._id)
    posts.forEach(async post => {
      let state = await UserPostModel.findOne({
        user_id,
        post_id: post,
      })
      if (state && state._id) {
        if (!state.read) {
          state.read = true
          state.save()
        }
      } else {
        state = new UserPostModel({
          user_id,
          feed_id:   id,
          post_id:   post,
          read:      true,
          read_date: Date.now(),
        })
        state.save()
      }
    })
  })
  ctx.body = {
    success: true,
    data:    '操作成功',
  }
}
