import * as types from '../mutation-types';

const state = {
    expand: false,
    error: [],
    info: []
}

const mutations = {
    // 收藏/取消收藏成功
    [types.EXPAND](state) {
        state.expand = true
    },

    [types.COLLAPSE](state) {
        state.expand = false
    },

    [types.ERROR](state, message) {
        state.error = [message]
    },

    [types.INFO](state, message) {
        state.info = [message]
    }
}

export default {
    state,
    mutations
}