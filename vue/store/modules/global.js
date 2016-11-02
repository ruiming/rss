import * as types from '../mutation-types'
import router from '../../router'
import Cookies from 'js-cookie'

const state = {
    expand:  false,
    loading: true,
    auth:    {
        email:    null,
        password: null
    },
    online: false,
    error:  null,
    info:   null
}

const mutations = {
    // 收藏/取消收藏成功
    [types.EXPAND](state) {
        state.expand = true
    },
    // 折叠侧边栏
    [types.COLLAPSE](state) {
        state.expand = false
    },
    // 接收错误
    [types.ERROR](state, message) {
        if (message === 'UnauthorizedError: Invalid token\n' || message === 'UnauthorizedError: No Authorization header found\n') {
            message = '请先登录!'
        }
        state.error = message
    },
    // 接收提示
    [types.INFO](state, message) {
        state.info = message
    },
    // 开始加载
    [types.LOADING_START](state) {
        state.loading = true
    },
    // 结束加载
    [types.LOADING_END](state) {
        state.loading = false
    },
    // 输入登录/注册邮箱
    [types.INPUT_EMAIL](state, value) {
        state.auth.email = value
    },
    // 输入登录/注册密码
    [types.INPUT_PASSWORD](state, value) {
        state.auth.password = value
    },
    // 在线状态
    [types.ONLINE](state) {
        state.online = true
    },
    // 下线操作
    [types.OFFLINE](state) {
        state.online = false
        Cookies.remove('jwt')
        Cookies.remove('XSRF-TOKEN')
        router.push({name: 'login'})
    },
    // 清除错误信息
    [types.CLEAR_ERROR](state) {
        state.error = null
    },
    // 清除提示信息
    [types.CLEAR_INFO](state) {
        state.info = null
    }
}

export default {
    state,
    mutations
}
