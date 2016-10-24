/**
 * 错误处理中间件
 */
module.exports = function() {
    return async (ctx, next) => {
        const deviceAgent = ctx.headers['user-agent'].toLowerCase();
        const mobile = deviceAgent.match(/(iphone|ipod|ipad|android)/);
        try {
            await next();

        } catch (err) {
            // Angular way            
            if(401 === err.status && !mobile) {
                ctx.clearcookies();
                if(ctx.request.body.email) {
                    await ctx.render('login.ejs', {err: err, email: ctx.request.body.email});
                } else {
                    ctx.status = 401;
                    ctx.body = { success: false, message: err };
                }
            } else {
                ctx.status = (err && err.status) || 404;
                if([null, undefined].includes(err)) {
                    ctx.body = { success: false, message: 'Unknown' };
                } else {
                    ctx.body = { success: false, message: err.toString() };
                }
            }
        }
    }
}
