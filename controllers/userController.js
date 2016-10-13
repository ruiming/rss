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
