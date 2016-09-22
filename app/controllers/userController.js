import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import config from '../../config/config'

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
    var result = await user.save().catch(e => e);
    if(result && result._id) {
        var token = jwt.sign(result._id, config.app.privateKey);
        ctx.cookies.set("token", token, {httpOnly: true, overwrite: true});
        ctx.body = { success: true, data: {email: result.email, username: result.username, _id: result.id, jwt: token }}; 
    } else {
        throw(result.errmsg);   // Attention!
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
        var token = jwt.sign(result._id, config.app.privateKey);
        ctx.cookies.set("token", token, {httpOnly: true, overwrite: true});
        ctx.body = { success: true, data: {email: result.email, username: result.username, _id: result.id, jwt: token }};        
    } else {
        throw('用户不存在');
    }
}
