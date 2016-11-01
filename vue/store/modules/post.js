import * as types from '../mutation-types';

const state = {
    post: {},
    status: {},
    pre: 0,
    next: 0
}

const mutations = {
    // 收藏/取消收藏成功
    [types.MARK_SUCCESS](state, id) {
        if(state.post._id === id) {
            state.post.mark = !state.post.mark
            state.status.mark = !state.status.mark            
        }
    },
    // 点赞/取消点赞成功
    [types.LOVE_SUCCESS](state, id) {
        if(state.post._id === id) {
            state.post.love = !state.post.mark
            state.status.love = !state.status.love            
        }
    },
    // 已读
    [types.READ_POST](state) {
        state.status.read = true
    },
    // 获取文章信息
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