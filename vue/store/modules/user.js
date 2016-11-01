import * as types from '../mutation-types';

const state = {
    user: {},
    originname: null,
    message: []
}

const mutations = {
    [types.UPDATE_USERNAME](state, username) {
        state.originname = username
    },

    [types.INPUT_USERNAME](state, username) {
        state.user.username = username
    },

    [types.RECEIVE_USER](state, { data }) {
        state.user = data
        state.originname = data.username
    }
}

export default {
    state,
    mutations
}