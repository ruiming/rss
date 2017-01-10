import UserModel from '../models/user'

/**
 * 获取用户信息
 * @method: get
 * @link:   /user
 */
exports.list = async (ctx, next) => {
  const user_id = ctx.state.user.id
  const result = await UserModel.findOne({
    _id: user_id,
  }, {
    password: 0,
    _id:      0,
  })
  if (result && result.email) {
    ctx.body = {
      success: true,
      data:    result,
    }
  } else {
    ctx.throw(404, '资源不存在')
  }
}

/**
 * 修改用户信息
 * @method: put
 * @link:   /user
 */
exports.update = async (ctx, next) => {
  const user = ctx.request.body
  const user_id = ctx.state.user.id
  const result = await UserModel.update({
    _id: user_id,
  }, user)
  if (result.ok) {
    ctx.body = {
      success: true,
      data:    result,
    }
  } else {
    ctx.body = {
      success: false,
      data:    '出错了',
    }
  }
}
