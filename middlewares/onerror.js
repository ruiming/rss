/**
 * 错误处理中间件
 */
module.exports = function() {
    return async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if(401 === err.status && !ctx.mobile) {
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
