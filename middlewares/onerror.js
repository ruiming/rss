/**
 * 错误处理中间件
 */
module.exports = function () {
    return async(ctx, next) => {
        try {
            await next()
        } catch (err) {
            if (err == null) {
                ctx.status = 500
                ctx.body = {
                    success: false,
                    message: '服务器开小差了~'
                }
            }
            if (err && 401 === err.status && !ctx.mobile) {
                ctx.clearcookies()
                if (ctx.request.body.email) {
                    if (ctx.request.body.json === 'true' || ctx.request.body.json === true) {
                        ctx.status = 401
                        ctx.body = {
                            success: false,
                            message: err.toString()
                        }
                    } else {
                        await ctx.render('login.ejs', {
                            err: err,
                            email: ctx.request.body.email
                        })
                    }
                } else {
                    ctx.status = 401
                    ctx.body = {
                        success: false,
                        message: err.toString()
                    }
                }
            } else {
                ctx.status = (err && err.status) || 404
                console.log(err)
                ctx.body = {
                    success: false,
                    message: err.toString()
                }
            }
        }
    }
}