import { SHA256 } from 'crypto-js'

module.exports = function () {
    return async (ctx, next) => {
        if (ctx.request.method === 'GET') {
            if (/favicon|image/.test(ctx.path)) {
                ctx.cacheControl = {
                    maxAge: 60 * 60 * 24 * 30
                }
            }
        } 
        await next()
    }
}
