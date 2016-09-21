import UserModel from '../models/user';

/**
 * 注册用户
 * @method: post
 * @url:    /api/auth/register
 * @params: {string} email
 * @params: {string} password
 */
exports.create = async (ctx, next) => {
    console.log(ctx.request.body);
    var user = new UserModel({
        email: ctx.request.body.email,
        password: ctx.request.body.password,
        name: ctx.request.body.email && ctx.request.body.email.split('@')[0]    // Default name
    });
    var result = await user.save().catch(e => e);
    if(result && result._id) {
        return ctx.body = { success: true, data: result };        
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
