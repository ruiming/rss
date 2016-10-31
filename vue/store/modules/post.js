import * as types from '../mutation-types';

const state = {
    post: {},
    status: {},
    pre: 0,
    next: 0
}

const mutations = {
    // 收藏成功
    [types.MARK_SUCCESS](state) {
        state.data.mark = true
    },

    // 收藏失败
    [types.MARK_FAILURE](state, { message }) {
        state.message.push(message)
    },

    // 点赞成功
    [types.LOVE_SUCCESS](state) {
        state.data.love = true
    },

    // 点赞失败
    [types.LOVE_FAILURE](state, { message }) {
        state.message.push(message)
    },

    [types.RECEIVE_POST](state, { post, pre, next, status }) {
        state.post = post
        state.status = status
        state.pre = pre
        state.next = next
    }
}

export default {
    state,
    mutations
}