import * as types from '../mutation-types';

const state = {
    expand: false
}

const mutations = {
    // 收藏/取消收藏成功
    [types.EXPAND](state) {
        state.expand = true
    },

    [types.COLLAPSE](state) {
        state.expand = false
    }
}

export default {
    state,
    mutations
}