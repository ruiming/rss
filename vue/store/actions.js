import { Feed, Feeds, User, Post, Posts } from '../resource/resource.js'
import * as types from './mutation-types'
import tools from '../../helper/help'
import Vue from 'vue'
import router from '../router'

// Feed

export const subscribe = async ({ commit, state }) => {
    Feed.save({
        feedlink: state.feed.feed.absurl
    }).then(res => {
        commit(types.SUBSCRIBE)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const unsubscribe = ({ commit, state }) => {
    Feed.delete({
        id: state.feed.feed.feed_id || state.feed.feed._id
    }).then(res => {
        commit(types.UNSUBSCRIBE)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const getFeed = ({ commit }, id) => {
    Feed.get({
        id: id
    }).then(res => {
        commit(types.RECEIVE_FEED, res.data)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const search = ({ commit, state }) => {
    if (!tools.checkUrl(state.feed.url)) {
        commit(types.ERROR, 'URL 不合法')
    } else {
        commit(types.SEARCHING_START)
        Feed.search({
            feedlink: state.feed.url
        }).then(res => {
            commit(types.SEARCHING_END, res.data)
            router.push({
                name: 'feed',
                params: {
                    id: res.data.data
                }
            })
        }, err => {
            commit(types.SEARCHING_END)
            commit(types.ERROR, err.data.message)
        })
    }
}

// Feeds

export const getAllFeeds = ({ commit }) => {
    // TODO Feed -> Feeds
    Feed.get().then(res => {
        commit(types.RECEIVE_FEEDS, res.data)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const getPopularFeeds = ({ commit }, page) => {
    Feeds.popular({
        page: page
    }).then(res => {
        commit(types.RECEIVE_FEEDS, res.data)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

// Post

export const getPost = ({ commit }, id) => {
    Post.get({
        id: id
    }).then(res => {
        commit(types.RECEIVE_POST, res.data.data)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const read = ({ commit, state }) => {
    if (state.post.status.read === false) {
        Post.update({
            id: state.post.post._id,
        }, {
            type: 'read'
        }).then(res => {
            commit(types.READ_POST)
        }, err => {
            commit(types.ERROR, err.data.message)
        })
    }
}

export const mark = ({ commit, state }, id) => {
    Post.update({
        id: id || state.post.post._id
    }, {
        type: 'mark',
        revert: true
    }).then(res => {
        commit(types.MARK, id || state.post.post._id)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const love = ({ commit, state }, id) => {
    Post.update({
        id: id || state.post.post._id
    }, {
        type: 'love',
        revert: true
    }).then(res => {
        commit(types.LOVE, id || state.post.post._id)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}


// Posts

export const getRecentPosts = ({ commit, state }) => {
    Posts.recent().then(res => {
        commit(types.RECEIVE_RECENT_POSTS, res.data)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const getFeedPosts = ({ commit, state }, id) => {
    Posts.get({
        feed_id: id
    }).then(res => {
        commit(types.RECEIVE_FEED_POSTS, res.data)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const getPosts = ({ commit, state }, type) => {
    Posts.get({
        type: type
    }).then(res => {
        commit(types.RECEIVE_POSTS, res.data)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const readAll = ({ commit, state }, posts) => {
    if(state.feed.unread) {
        Posts.update({
            feed_id: state.feed.feed.feed_id,
            type: 'read'
        }).then(res => {
            commit('READ_ALL')
        }, err => {
            commit('ERROR', err.data.message)
        })
    }
}

// User

export const getUser = ({ commit, state }) => {
    User.get().then(res => {
        commit(types.RECEIVE_USER, res.data)
        commit(types.ONLINE)
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const updateUser = ({ commit, state }) => {
    User.update(state.user.user).then(res => {
        commit(types.UPDATE_USERNAME, state.user.user.username)
    }, err => {
        commit(types.ERROR, err.data.message)
        commit(type.INPUT_USERNAME, state.user.originname)
    })
}

// Global

export const authenticate = ({ commit, state }) => {
    Vue.http.post('/auth/login', {
        email: state.global.auth.email,
        password: state.global.auth.password
    }).then(res => {
        commit(types.ONLINE)
        router.replace('/')
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}

export const register = ({ commit, state }) => {
    Vue.http.post('/auth/register', state.global.auth).then(res => {
        commit(types.ONLINE)
        router.replace('/')
    }, err => {
        commit(types.ERROR, err.data.message)
    })
}