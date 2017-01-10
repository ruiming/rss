import * as types from '../mutation-types'

const state = {
  user:       {},
  originname: null,
  message:    [],
}

const mutations = {
    // 更新用户名
  [types.UPDATE_USERNAME](state, username) {
    state.originname = username
  },
    // 修改用户名
  [types.INPUT_USERNAME](state, username) {
    state.user.username = username
  },
    // 接收用户信息
  [types.RECEIVE_USER](state, { data }) {
    state.user = data
    state.originname = data.username
  },
}

export default {
  state,
  mutations,
}
