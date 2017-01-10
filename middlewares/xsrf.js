import jwt from 'koa-jwt'
import config from '../config/config'

module.exports = () => async (ctx, next) => {
  const token = ctx.cookies.get('jwt')
  const xsrf = ctx.request.headers['x-xsrf-token']
  if (ctx.request.header.authorization == null) {
    ctx.request.header.authorization = `Bearer ${token}`
  }
  if (undefined !== token && /^\/api\//.test(ctx.url)) {
    const verify = Promise.promisify(jwt.verify)
    await verify(token, config.APP.JWT_KEY).then(async (data) => {
      if (xsrf !== data.xsrf) {
        ctx.clearcookies()
        ctx.status = 401
        ctx.body = {
          success: false,
          message: '用户验证失败',
        }
      } else {
        await next()
      }
    }, () => {
      ctx.clearcookies()
      ctx.status = 401
      ctx.body = {
        success: false,
        message: '用户验证失败',
      }
    })
  } else {
    await next()
  }
}
