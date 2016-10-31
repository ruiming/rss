import * as types from '../mutation-types';

const state = {
    expand: false,
    loading: true,
    auth: {
        email: null,
        password: null
    },
    online: false,
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
    },

    [types.LOADING_START](state) {
        state.loading = true
    },

    [types.LOADING_END](state) {
        state.loading = false
    },

    [types.INPUT_EMAIL](state, value) {
        state.auth.email = value
    },

    [types.INPUT_PASSWORD](state, value) {
        state.auth.password = value
    }
}

export default {
    state,
    mutations
}