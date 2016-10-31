import { Feed, Feeds, User, Post, Posts } from '../resource/resource.js'
import * as types from './mutation-types'
import tools from '../../helper/help'

// Feed

export const subscribe = ({ commit, state }) => {
    Feed.save({
        feedlink: state.feed.feed.absurl
    }).then(res => {
        commit(types.SUBSCRIBE_SUCCESS)
    }, err => {
        commit(types.SUBSCRIBE_FAILURE, err)
    })
}

export const unsubscribe = ({ commit, state }) => {
    Feed.delete({
        id: state.feed.feed.feed_id || state.feed.feed._id
    }).then(res => {
        commit(types.UNSUBSCRIBE_SUCCESS)
    }, err => {
        commit(types.UNSUBSCRIBE_FAILURE, err.data)
    })
}

export const getFeed = ({ commit }, id) => {
    return Feed.get({
        id: id
    }).then(res => {
        commit(types.RECEIVE_FEED, res.data)
    })
}

export const search = ({ commit }, url) => {
    if(!tools.checkUrl(url)) {
        commit(types.ERROR, 'URL 不合法')
    } else {
        commit(types.SEARCHING_START)
        Feed.search({
            feedlink: url
        }).then(res => {
            commit(types.SEARCHING_END, res.data)
        }, err => {
            commit(types.SEARCHING_END)
            commit(types.ERROR, err.data.message)
        })
    }
}

// Feeds

export const getAllFeeds = ({ commit }) => {
    // TODO Feed -> Feeds
    return Feed.get().then(res => commit(types.RECEIVE_FEEDS, res.data))
}

export const getPopularFeeds = ({ commit }, page) => {
    return Feeds.popular({
        page: page
    }).then(res => {
        commit(types.RECEIVE_FEEDS, res.data)
    })
}

// Post
export const getPost = ({ commit }, id) => {
    return Post.get({
        id: id
    }).then(res => {
        commit(types.RECEIVE_POST, res.data.data)
    })
}

export const read = ({ commit, state }) => {
    if (state.post.status.read === false) {
        return Post.update({
            id: state.post.post._id,
        }, {
            type: 'read'
        }).then(res => {
            commit(types.READ_POST)
        })
    }
}

export const mark = ({ commit, state }) => {
    Post.update({
        id: state.post.post._id
    }, {
        type: 'mark',
        revert: true
    }).then(res => {
        commit(types.MARK_SUCCESS)
    }, err => {
        commit(types.MARK_FAILURE, err.data)
    })
}

export const love = ({ commit, state }) => {
    Post.update({
        id: state.post.post._id
    }, {
        type: 'love',
        revert: true
    }).then(res => {
        commit(types.LOVE_SUCCESS)
    }, err => {
        commit(types.LOVE_FAILURE, err.data)
    })
}


// Posts
export const getRecentPosts = ({ commit, state }) => {
    Posts.recent().then(res => commit(types.RECEIVE_POSTS, res.data))
}

export const getFeedPosts = ({ commit, state }, id) => {
    Posts.get({
        feed_id: id
    }).then(res => {
        commit(types.RECEIVE_POSTS, res.data)
    })
}

export const getPosts = ({ commit, state }, type) => {
    Posts.get({
        type: type
    }).then(res => {
        commit(types.RECEIVE_POSTS, res.data)
    })
}

export const readAll = ({ commit, state }, posts) => {
    if(state.read) {
        return
    } else {
        Posts.update({
            feed_id: state.feed.feed.feed_id,
            type: 'read'
        }).then(res => {
            commit('READ_ALL_SUCCESS')
        }, err => {
            commit('READ_ALL_FAILURE', err.data)
        })
    }
}

// User
export const getUser = ({ commit, state }) => {
    User.get().then(res => {
        commit(types.RECEIVE_USER, res.data)
    })
}

export const updateUser = ({ commit, state }, data) => {
    User.update(data).then(res => {
        commit(types.UPDATE_USER_SUCCESS)
    }, err => {
        commit(types.UPDATE_USER_FAILURE, err.data)
    })
}
