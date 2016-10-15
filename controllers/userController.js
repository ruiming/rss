import UserModel from '../models/user';

/**
 * 这里主要是涉及用户的接口
 */

/**
 * 获取用户信息
 * @method: get 
 * @link:   /user
 */
exports.list = async (ctx, next) => {
    let user_id = ctx.state.user.id;
    let result = await UserModel.findOne({_id: user_id}, {password: 0, _id: 0});
    if(result && result.email) {
        ctx.body = { success: true, data: result};
    } else {
        ctx.throw(404, '资源不存在');
    }
}

/**
 * 修改用户信息
 * @method: put
 * @link:   /user
 */
exports.update = async (ctx, next) => {
    let user = ctx.request.body, user_id = ctx.state.user.id;
    let result = await UserModel.update({_id: user_id}, user);
    if(result.ok) {
        ctx.body = { success: true,  data: result };
    } else {
        ctx.body = { success: false, data: '出错了' };
    }
}
