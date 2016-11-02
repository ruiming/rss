/**
 * 判断UA
 */
module.exports = function () {
    return async(ctx, next) => {
        const deviceAgent = ctx.headers['user-agent'].toLowerCase()
        ctx.mobile = deviceAgent.match(/(iphone|ipod|ipad|android|java|httpclient)/)
        await next()
    }
}
