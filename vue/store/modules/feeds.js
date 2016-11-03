import * as types from '../mutation-types'
import _ from 'underscore'

const state = {
    feeds:     {},
    userfeeds: []
}

const mutations = {
    // 获取全部订阅源
    [types.RECEIVE_FEEDS](state, { data }) {
        state.feeds = data
    },
    // 获取用户订阅源
    [types.RECEIVE_USER_FEEDS](state, { data }) {
        state.userfeeds = data
    },
    // 标记已读
    [types.READ_POST](state, { feed_id }) {
        state.userfeeds = _.map(state.userfeeds, feed => {
            if (feed.feed_id === feed_id) {
                feed.unread --
            }
            return feed
        })
    },
    // 增加订阅
    [types.SUBSCRIBE](state, feed) {
        state.userfeeds = [...state.userfeeds, {...feed, folder: 'default'}]
    },
    // 取消订阅
    [types.UNSUBSCRIBE](state, { feed_id }) {
        state.userfeeds = _.filter(state.userfeeds, feed => feed.feed_id !== feed_id)
    }
}

export default {
    state,
    mutations
}
