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
        state.userfeeds = state.userfeeds.map(feed => {
            if (feed._id === feed_id) {
                feed.unread --
            }
            return feed
        })
    },
    // 全部标记已读
    [types.READ_ALL](state, feed_id) {
        state.userfeeds = state.userfeeds.map(feed => {
            if (feed._id === feed_id) {
                feed.unread = 0
            }
            return feed
        })
    },
    // 增加订阅
    [types.SUBSCRIBE](state, feed) {
        let exist = true
        state.userfeeds = [...state.userfeeds, feed]
        state.feeds = state.feeds.map(item => {
            if (item._id === feed._id) {
                item.feedNum++
                exist = false
            }
            return item
        })
        if (exist) {
            state.feeds = [...state.feeds, feed]
        }
    },
    // 取消订阅
    [types.UNSUBSCRIBE](state, { _id }) {
        state.userfeeds = state.userfeeds.filter(feed => feed._id !== _id)
        state.feeds = state.feeds.map(item => {
            if (item._id === _id) {
                item.feedNum--
            }
            return item
        })
    },
}

export default {
    state,
    mutations
}
