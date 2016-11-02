import UserModel from '../models/user'
import { MD5, SHA256 } from 'crypto-js'
import request from 'request'

/**
 * 注册用户
 * @method: post
 * @link:   /auth/register
 * @param:  {string} email
 * @param:  {string} password
 * @params: {boolean} json
 */
exports.register = async (ctx, next) => {
    let email = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i
    if (ctx.request.body.password.length < 6 || ctx.request.body.password.length > 18) {
        ctx.throw(401, '密码长度有误')
    } else if (!email.test(ctx.request.body.email)) {
        ctx.throw(401, '邮箱有误')
    } else {
        let user = null,
            result = null,
            req = request({
                url:     `https://www.gravatar.com/${MD5(ctx.request.body.email.trim().toLowerCase())}.json`,
                headers: {
                    'User-Agent': 'request'
                }
            })

        await new Promise(async (resolve) => {
            req.on('data', async(data) => {
                if (JSON.parse(data.toString()).entry) {
                    data = JSON.parse(data.toString()).entry[0]
                    data.thumbnailUrl = data.thumbnailUrl.replace(/^(http)/, 'https')
                } else {
                    data = {
                        preferredUsername: ctx.request.body.email.split('@')[0],
                        thumbnailUrl:      '/img/avatar.png'
                    }
                }
                user = new UserModel({
                    email:    ctx.request.body.email.trim(),
                    password: SHA256(ctx.request.body.password),
                    username: data.preferredUsername || data.displayName || (ctx.request.body.email && ctx.request.body.email.split('@')[0]),
                    avatar:   data.thumbnailUrl
                })
                result = await user.save().catch(e => e)
                resolve()
            })
        })
        
        if (result && result._id) {
            let auth = ctx.setAuthCookies(result._id)
            if (ctx.request.body.json === 'true' || ctx.request.body.json === true) {
                ctx.body = {
                    success: true,
                    body:    auth
                }
            } else {
                await ctx.redirect('/')
            }
        } else {
            ctx.throw(401, '邮箱已经被注册了')
        }
    }
}

/**
 * 登陆
 * @method: post
 * @link:   /auth/login
 * @param:  {string} email
 * @param:  {string} password
 */
exports.login = async(ctx, next) => {
    let result = await UserModel.findOne({
        email:    ctx.request.body.email,
        password: SHA256(ctx.request.body.password).toString()
    })
    if (result && result._id) {
        let auth = ctx.setAuthCookies(result._id)
        if (ctx.request.body.json === 'true' || ctx.request.body.json === true) {
            ctx.body = {
                success: true,
                body:    auth
            }
        } else {
            await ctx.redirect('/')
        }
    } else {
        let exist = await UserModel.findOne({
            email: ctx.request.body.email
        })
        if (exist && exist._id) {
            ctx.throw(401, '密码错误')
        } else {
            ctx.throw(401, '邮箱未注册')
        }
    }
}

/**
 * 注销
 * @method: post
 * @link:   /auth/logout
 */
exports.logout = (ctx, next) => {
    ctx.clearcookies()
    ctx.status = 401
    ctx.body = {
        success: true,
        message: '已退出系统'
    }
}
