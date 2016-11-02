import * as types from '../mutation-types'

const state = {
    feeds:   {},
    message: []
}

const mutations = {
    // 获取全部订阅源
    [types.RECEIVE_FEEDS](state, { data }) {
        state.feeds = data
    }
}

export default {
    state,
    mutations
}
