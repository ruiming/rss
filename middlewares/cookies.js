import _ from 'underscore'
import { SHA256 } from 'crypto-js'
import jwt from 'jsonwebtoken'
import config from '../config/config'


module.exports = () => async (ctx, next) => {
  ctx.clearcookies = () => {
    ctx.cookies.set('XSRF-TOKEN', null, {
      overwrite: true,
      expires:   new Date(),
    })
    ctx.cookies.set('jwt', null, {
      overwrite: true,
      expires:   new Date(),
    })
  }
  ctx.setAuthCookies = (_id) => {
    const xsrf = SHA256(_.random(999999999)).toString()
    const secure = config.ENV === 'production'
    const date = new Date().getTime() + 5184000000
    const token = jwt.sign({
      id:  _id,
      xsrf,
      exp: date / 1000,
    }, config.APP.JWT_KEY)
    ctx.cookies.set('XSRF-TOKEN', xsrf, {
      httpOnly:  false,
      overwrite: true,
      expires:   new Date(date),
      secure,
    })
    ctx.cookies.set('jwt', token, {
      httpOnly:  true,
      overwrite: true,
      expires:   new Date(date),
      secure,
    })
    return {
      jwt: token,
      xsrf,
      exp: date / 1000,
    }
  }
  await next()
}
