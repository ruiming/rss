import { SHA256 } from 'crypto-js'

module.exports = function () {
    return async (ctx, next) => {
        // 只缓存 GET 请求
        if (ctx.request.method === 'GET') {
            if (/image/.test(ctx.type)) {
                ctx.cacheControl = {
                    maxAge: 60 * 60 * 24 * 30
                }
            }
        }
        await next()                
    }
}
