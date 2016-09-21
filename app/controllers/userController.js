import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import config from '../../config/config'

/**
 * 注册用户
 * @method: post
 * @url:    /api/auth/register
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
        //ctx.cookies.set("token", token, {expires: new Date(new Date().getTime() + 7776000), httpOnly: true, overwrite: true});
        return ctx.body = { success: true, data: {email: result.email, username: result.username, _id: result.id, jwt: token }}; 
    } else {
        throw(result.errmsg);   // Attention!
    }
}

/**
 * 登陆
 * @method: post
 * @url:    /api/auth/login
 * @params: {string} email
 * @params: {string} password
 */
exports.get = async (ctx, next) => {
    var result = await UserModel.findOne({email: ctx.params.email, password: ctx.params.password}).catch(e => e);
    if(result && result._id) {
        return ctx.body = { success: true, data: result };        
    } else {
        throw('用户不存在');
    }
}
