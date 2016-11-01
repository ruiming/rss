import * as types from '../mutation-types';

const state = {
    feed: {},
    url: null,
    searching: false,
    message: []
}

const mutations = {
    // 订阅
    [types.SUBSCRIBE](state) {
        state.feed.feed_time = Date.now()
    },
    // 取消订阅
    [types.UNSUBSCRIBE](state) {
        state.feed.feed_time = 0
    },
    // 获取订阅源
    [types.RECEIVE_FEED](state, { data }) {
        if(!data.feed_time) {
            data.feed_time = 0
        }
        state.feed = data
    },
    // 全部标记已读
    [types.READ_ALL](state) {
        state.feed.unread = 0
    },
    // 开始搜索
    [types.SEARCHING_START](state) {
        state.searching = true
    },
    // 结束搜索
    [types.SEARCHING_END](state) {
        state.searching = false
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