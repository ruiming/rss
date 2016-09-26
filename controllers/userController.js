import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import config from '../config/config'
import send from 'koa-send';

/**
 * 注册用户
 * @method: post
 * @url:    /auth/register
 * @params: {string} email
 * @params: {string} password
 */
exports.create = async (ctx, next) => {
    var user = new UserModel({
        email: ctx.request.body.email,
        password: ctx.request.body.password,
        username: ctx.request.body.email && ctx.request.body.email.split('@')[0]    // Default name
    });
    var result = await user.save();
    if(result && result._id) {
        var token = jwt.sign(result._id, config.app.secretKey);
        ctx.cookies.set("token", token, {httpOnly: true, overwrite: true, expires: new Date(new Date().getTime() +  86400000000)});
        await ctx.redirect('/');
    } else {
        ctx.throw(404, result.errmsg);   // Attention!
    }
}

/**
 * 登陆
 * @method: post
 * @url:    /auth/login
 * @params: {string} email
 * @params: {string} password
 */
exports.get = async (ctx, next) => {
    var result = await UserModel.findOne({email: ctx.request.body.email, password: ctx.request.body.password}).catch(e => e);
    if(result && result._id) {
        var token = jwt.sign({id: result._id}, config.app.secretKey);
        ctx.cookies.set("jwt", token, {httpOnly: false, overwrite: true, expires: new Date(new Date().getTime() +  86400000000)});
        await ctx.redirect('/');
    } else {
        ctx.throw(404, '用户不存在');
    }
}
