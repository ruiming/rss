module.exports = () => async (ctx, next) => {
  const deviceAgent = ctx.headers['user-agent'] && ctx.headers['user-agent'].toLowerCase()
  ctx.mobile = deviceAgent && deviceAgent.match(/(iphone|ipod|ipad|android|java|httpclient)/)
  await next()
}
