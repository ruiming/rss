module.exports = () => async (ctx, next) => {
  if (/^https:\/\/[^www.]/.test(ctx.origin)) {
    ctx.status = 301
    ctx.redirect(`https://www.${ctx.host}`)
  } else {
    await next()
  }
}
