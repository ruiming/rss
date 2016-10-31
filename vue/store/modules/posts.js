import * as types from '../mutation-types';

const state = {
    posts: [],
    status: []
}

const mutations = {
    [types.RECEIVE_POSTS](state, { data }) {
        if(!Array.isArray(data)) {
            state.posts = data.posts
            state.status = data.status    
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