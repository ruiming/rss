import { SHA256 } from 'crypto-js'

module.exports = function () {
    return async (ctx, next) => {
        await next()
        if (/image/.test(ctx.type)) {
            // 检查 if-none-match 头匹配 Etag
            if (ctx.get('if-none-match') === SHA256(ctx.response.body).toString()) {
                ctx.status = 304
            }
            // 控制客户端缓存时间 30 天
            ctx.cacheControl = {
                maxAge: 60 * 60 * 24 * 30
            }
            // 设置 Etag 值, Etag 根据文件 body 生成
            ctx.set({
                'Etag': SHA256(ctx.response.body).toString(),
            })
        } else {
            // 对于其他资源, 使用 Etag 标记处理
            if (ctx.get('if-none-match') === SHA256(ctx.response.body).toString()) {
                ctx.status = 304
            }
            ctx.set({
                'Etag': SHA256(ctx.response.body).toString(),
            })
        }
    }
}
