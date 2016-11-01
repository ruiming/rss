import jwt from 'koa-jwt'
import config from '../config/config'

/**
 * XSRF 检测中间件
 */
module.exports = function () {
    return async(ctx, next) => {
        let token = ctx.cookies.get('jwt'),
            xsrf = ctx.request.headers['x-xsrf-token']
        ctx.request.header.authorization = 'Bearer ' + token
        if (undefined !== token && /^\/api\//.test(ctx.url)) {
            let verify = Promise.promisify(jwt.verify)
            await verify(token, config.APP.JWT_KEY).then(async(data) => {
                if (xsrf !== data.xsrf) {
                    ctx.clearcookies()
                    ctx.status = 401
                    ctx.body = {
                        success: false,
                        message: '用户验证失败'
                    }
                } else {
                    await next()
                }
            }, err => {
                ctx.clearcookies()
                ctx.status = 401
                ctx.body = {
                    success: false,
                    message: '用户验证失败'
                }
            })
        } else {
            await next()
        }
    }
}