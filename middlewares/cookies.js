module.exports = async (ctx, next) => {
    // 清除 cookies
    ctx.clearcookies = () =>  {
        ctx.cookies.set("XSRF-TOKEN", null, {overwrite: true, expires: new Date()});
        ctx.cookies.set("jwt", null, {overwrite: true, expires: new Date()});
    };
    await next();
}
