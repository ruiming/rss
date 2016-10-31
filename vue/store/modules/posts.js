import * as types from '../mutation-types'
import _ from 'underscore'
import timeago from 'timeago.js'

const state = {
    posts: [],
    status: []
}

const mutations = {
    [types.RECEIVE_POSTS](state, { data }) {
        if(!Array.isArray(data)) {
            state.posts = _.sortBy(data.posts, 'pubdate').reverse()
            state.status = _.groupBy(data.detail, 'post_id')
            for(let post of state.posts) {
                if(post.pubdate != null) {
                    post.pubdate = new timeago().format(post.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN') 
                }
                post.read = state.status[post._id] && state.status[post._id][0].read
            }
        } else {
            state.posts = data
        }
    },

    [types.READ_ALL_SUCCESS](state) {
        for(let post of state.posts) {
            post.read = true
        }
    }
}

export default {
    state,
    mutations
}