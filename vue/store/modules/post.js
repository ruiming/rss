import * as types from '../mutation-types';

const state = {
    post: {},
    status: {},
    pre: 0,
    next: 0
}

const mutations = {
    // 收藏/取消收藏成功
    [types.MARK_SUCCESS](state) {
        state.status.mark = !state.status.mark
    },

    // 收藏/取消收藏失败
    [types.MARK_FAILURE](state, { message }) {
        state.message.push(message)
    },

    // 点赞/取消点赞成功
    [types.LOVE_SUCCESS](state) {
        state.status.love = !state.status.love
    },

    // 点赞/取消点赞失败
    [types.LOVE_FAILURE](state, { message }) {
        state.message.push(message)
    },

    // 已读
    [types.READ_POST](state) {
        state.status.read = true
    },

    [types.RECEIVE_POST](state, { result, pre, next, detail }) {
        if(detail == null) {
            detail = { mark: false, love: false, read: false }
        }
        state.post = result
        state.status = detail
        state.pre = pre
        state.next = next
    }
}

export default {
    state,
    mutations
}