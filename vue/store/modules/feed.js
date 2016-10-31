import * as types from '../mutation-types';

const state = {
    feed: {},
    url: null,
    searching: false,
    message: []
}

const mutations = {
    // 订阅成功
    [types.SUBSCRIBE_SUCCESS](state) {
        state.feed.feed_time = Date.now()
    },

    // 订阅失败
    [types.SUBSCRIBE_FAILURE](state, { message }) {
        state.message.push(message)
    },

    // 取消订阅成功
    [types.UNSUBSCRIBE_SUCCESS](state) {
        state.feed.feed_time = 0
    },

    // 取消订阅失败
    [types.UNSUBSCRIBE_FAILURE](state, { message }) {
        state.message.push(message)
    },

    // 获取订阅源
    [types.RECEIVE_FEED](state, { data }) {
        state.feed = data
    },

    // 标记已读
    [types.READ_ALL_SUCCESS](state) {
        state.feed.unread = 0
    },

    // 开始搜索
    [types.SEARCHING_START](state) {
        state.searching = true
    },

    // 结束搜索
    [types.SEARCHING_END](state, { data }) {
        state.SEARCHING = false
        // 成功搜索返回 FEED_ID
        if(data != null) {
            state.SEARCHING = data
        }
    },

    // 更新 URL 值
    [types.UPDATE_URL](state, value) {
        state.url = value
    }
}

export default {
    state,
    mutations
}