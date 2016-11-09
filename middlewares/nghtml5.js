import send from 'koa-send'

/**
 * Html5mode Support
 */
module.exports = function () {
    return async(ctx, next) => {
        if (/^\/(mark|square|feed|feeds|post|posts|me|search)/.test(ctx.request.url)) {
            if (ctx.mobile) {
                await send(ctx, './public/index.html')
            }
            else {
                await send(ctx, './public/pc.html')
            }
        }
        await next()
    }
}
