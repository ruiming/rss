import * as types from '../mutation-types';

const state = {
    user: {},
    message: []
}

const mutations = {
    [types.UPDATE_USER_SUCCESS](state, { username }) {
        state.user.username = username
    },

    [types.UPDATE_USER_FAILURE](state, { message }) {
        state.message.push(message)
    },

    [types.RECEIVE_USER](state, { data }) {
        state.user = data
    }
}

export default {
    state,
    mutations
}