import * as types from '../mutation-types'
import _ from 'underscore'
import timeago from 'timeago.js'

const state = {
    feedPosts: [],
    recentPosts: [],
    status: [],    
    posts: []
}

const mutations = {
    [types.RECEIVE_FEED_POSTS](state, { data }) {
        state.feedPosts = _.sortBy(data.posts, 'pubdate').reverse()
        state.status = _.groupBy(data.detail, 'post_id')
        for(let post of state.feedPosts) {
            if(post.pubdate != null) {
                post.pubdate = new timeago().format(post.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN') 
            }
            post.read = state.status[post._id] && state.status[post._id][0].read
        }
    },

    [types.RECEIVE_RECENT_POSTS](state, { data }) {
        state.recentPosts = data        
        for(let post of state.recentPosts) {
            if(post.pubdate != null) {
                post.pubdate = new timeago().format(post.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN') 
            }
        }
    },

    [types.RECEIVE_POSTS](state, { data }) {
        state.posts = data
    },

    [types.READ_ALL_SUCCESS](state) {
        for(let post of state.posts) {
            post.read = true
        }
    },

    [types.MARK_SUCCESS](state, id) {
        state.posts = _.map(state.posts, post => {
            if(post._id === id) post.mark = !post.mark
            return post
        })
    },

    [types.LOVE_SUCCESS](state, id) {
        state.posts = _.map(state.posts, post => {
            if(post._id === id) post.love = !post.love
            return post
        })
    }
}

export default {
    state,
    mutations
}