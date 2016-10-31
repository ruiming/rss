import * as types from '../mutation-types';
import { Feed } from '../../resource';
import timeago from 'timeago.js';

const state = {
    data: {}
}

const actions = {
    [types.SUBSCRIBE](state, { feedlink }) {
        return Feed.save({
            feedlink: feedlink
        }).then(res => {
            state.data.feed_time = undefined
        })
    },

    [types.UNSUBSCRIBE](state, { id }) {
        return Feed.delete({
            id: id
        }).then(res => {
            state.data.feed_time = Date.now()
        })
    }
}

const getters = {
    feed: state => {
        if(state.data.pubdate != null) {
            state.data.pubdate = new timeago().format(state.data.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN')
        }
        return state.data
    }
}

export default {
    state,
    actions
}