import * as types from '../mutation-types';

const state = {
    feed: {},
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
        data.feed_time = undefined
    },

    // 取消订阅失败
    [types.UNSUBSCRIBE_FAILURE](state, { message }) {
        state.message.push(message)
    },

    // 获取订阅源
    [types.RECEIVE_FEED](state, { data }) {
        console.log(data)
        state.feed = data
    }
}

export default {
    state,
    mutations
}