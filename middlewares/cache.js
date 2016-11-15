import { SHA256 } from 'crypto-js'

module.exports = function () {
    return async (ctx, next) => {
        // 只缓存 GET 请求
        if (ctx.request.method === 'GET') {
            if (/image/.test(ctx.type)) {
                // 检查 if-none-match 头匹配 Etag
                if (ctx.get('if-none-match') === SHA256(ctx.response.body).toString()) {
                    ctx.status = 304
                } else {
                    // 控制客户端缓存时间 30 天
                    ctx.cacheControl = {
                        maxAge: 60 * 60 * 24 * 30
                    }
                }
            }
        }
        await next()                
    }
}
