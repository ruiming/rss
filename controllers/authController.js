import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import send from 'koa-send';
import config from '../config/config';
import { MD5, SHA256 } from 'crypto-js';
import request from 'request';

/**
 * 这里主要是登录注册用
 */

/**
 * 注册用户
 * @method: post
 * @url:    /auth/register
 * @params: {string} email
 * @params: {string} password
 */
exports.register = async (ctx, next) => {
    let email = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i;
    if(ctx.request.body.password.length < 6 || ctx.request.body.password.length > 18) ctx.throw(404, '密码长度有误');
    else if(!email.test(ctx.request.body.email)) ctx.throw(404, '邮箱有误');
    else {
        let req = request({url:`https://www.gravatar.com/${MD5(ctx.request.body.email.trim().toLowerCase())}.json`, headers: {'User-Agent': 'request'}});
        let user = null, result = null;
        await new Promise(async (resolve, reject) => {
            req.on('data', async (data) => {
                data = JSON.parse(data.toString()).entry[0];
                user = new UserModel({
                    email: ctx.request.body.email.trim(),
                    password: SHA256(ctx.request.body.password),
                    username: data.preferredUsername || data.displayName || (ctx.request.body.email && ctx.request.body.email.split('@')[0]),
                    avatar: data.thumbnailUrl
                });
                result = await user.save();
                resolve();
            });
        });
        if(result && result._id) {
            let token = jwt.sign({id: result._id}, config.app.secretKey);
            ctx.cookies.set("jwt", token, {httpOnly: false, overwrite: true, expires: new Date(new Date().getTime() +  86400000000)});
            await ctx.redirect('/');
        } else {
            ctx.throw(404, result.errmsg);
        }
    };
}

/**
 * 登陆
 * @method: post
 * @url:    /auth/login
 * @params: {string} email
 * @params: {string} password
 */
exports.login = async (ctx, next) => {
    let result = await UserModel.findOne({
        email: ctx.request.body.email, 
        password: SHA256(ctx.request.body.password).toString()});
    if(result && result._id) {
        let token = jwt.sign({id: result._id}, config.app.secretKey);
        ctx.cookies.set("jwt", token, {httpOnly: false, overwrite: true, expires: new Date(new Date().getTime() +  86400000000)});
        await ctx.redirect('/');
    } else {
        ctx.throw(404, '用户不存在');
    }
}
