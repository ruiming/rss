import Cookies from 'js-cookie'
import * as types from '../mutation-types'
import router from '../../router'

const state = {
  expand:  false,
  loading: true,
  auth:    {
    email:    null,
    password: null,
  },
  online: true,
  error:  null,
  info:   null,
  timer:  {
    error: null,
    info:  null,
  },
  prefetch: {
    recentposts:  false,
    userfeeds:    false,
    markposts:    false,
    popularfeeds: false,
  },
}

const mutations = {
    // prefetch 状态修改
  [types.PREFETCH](state, { type, status }) {
    state.prefetch[type] = status
  },
    // 收藏/取消收藏成功
  [types.EXPAND](state) {
    state.expand = true
  },
    // 折叠侧边栏
  [types.COLLAPSE](state) {
    state.expand = false
  },
    // 接收错误
  [types.ERROR](state, { message }) {
    if (message === 'UnauthorizedError: Invalid token\n' || message === 'UnauthorizedError: No Authorization header found\n') {
      message = '请先登录!'
    }
    state.info = null
    state.error = message
  },
    // 接收提示
  [types.INFO](state, { message }) {
    state.error = null
    state.info = message
  },
    // 设置错误计时器
  [types.SET_ERROR_TIMEOUT](state, timeoutId) {
    if (timeoutId === null) {
      state.error = null
    } else {
      clearTimeout(state.timer.error)
    }
    state.timer.error = timeoutId
  },
    // 设置提示计时器
  [types.SET_INFO_TIMEOUT](state, timeoutId) {
    if (timeoutId === null) {
      state.info = null
    } else {
      clearTimeout(state.timer.info)
    }
    state.timer.info = timeoutId
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
    router.push({ name: 'login' })
  },
}

export default {
  state,
  mutations,
}
