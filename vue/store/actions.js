import { Feed, Feeds, User, Post, Posts } from '../resource/resource.js'
import * as types from './mutation-types'
import tools from '../../utils'
import Vue from 'vue'
import router from '../router'

// Feed

export const subscribe = ({ commit, state }) => {
    return Feed.save({
        feedlink: state.feed.feed.absurl
    }).then(() => {
        commit(types.SUBSCRIBE, state.feed.feed)
        commit(types.INFO, {
            message: '成功订阅'
        })
    })
}

export const unsubscribe = ({ commit, state }) => {
    return Feed.delete({
        id: state.feed.feed._id
    }).then(() => {
        commit(types.UNSUBSCRIBE, state.feed.feed)
        commit(types.INFO, {
            message: '已取消订阅'
        })
    })
}

export const getFeed = ({ commit }, id) => {
    return Feed.get({
        id: id
    }).then(res => {
        commit(types.RECEIVE_FEED, res.data)
    })
}

export const search = ({ commit, state }) => {
    if (!tools.checkUrl(state.feed.url)) {
        commit(types.ERROR, 'URL 不合法')
    } else {
        commit(types.SEARCHING_START)
        return Feed.search({
            feedlink: state.feed.url
        }).then(res => {
            commit(types.SEARCHING_END)
            router.push({
                name:   'feed',
                params: {
                    id: res.data.data
                }
            })
        }, () => {
            commit(types.SEARCHING_END)
        })
    }
}

// Feeds

export const getAllFeeds = ({ commit }) => {
    Feed.get().then(res => {
        commit(types.RECEIVE_USER_FEEDS, res.data)
    })
}

export const getPopularFeeds = ({ commit }, page) => {
    return Feeds.popular({
        page: page || 0
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
    if (!state.post.post.read) {
        return Post.update({
            id: state.post.post._id,
        }, {
            type: 'read'
        }).then(() => {
            commit(types.READ_POST, state.post.post)
        })
    }
}

export const mark = ({ commit, state }) => {
    return Post.update({
        id: state.post.post._id
    }, {
        type:   'mark',
        revert: true
    }).then(() => {
        commit(types.MARK, state.post.post)
    })
}

export const love = ({ commit, state }) => {
    return Post.update({
        id: state.post.post._id
    }, {
        type:   'love',
        revert: true
    }).then(() => {
        commit(types.LOVE, state.post.post)
    })
}


// Posts

export const getRecentPosts = ({ commit }) => {
    return Posts.recent().then(res => {
        commit(types.RECEIVE_RECENT_POSTS, res.data)
    })
}

export const getFeedPosts = ({ commit, state }, id) => {
    return Posts.get({
        feed_id: id
    }).then(res => {
        commit(types.RECEIVE_FEED_POSTS, res.data)
    })
}

export const getPosts = ({ commit, state }, type) => {
    return Posts.get({
        type: type
    }).then(res => {
        commit(types.RECEIVE_POSTS, res.data)
    })
}

export const readAll = ({ commit, state }) => {
    if (state.feed.feed.unread) {
        return Posts.update({
            feed_id: state.feed.feed._id,
            type:    'read'
        }).then(() => {
            commit('READ_ALL', state.feed.feed._id)
            commit(types.INFO, {
                message: '操作成功'
            })
        })
    }
}

// User

export const getUser = ({ commit }) => {
    return User.get().then(res => {
        commit(types.RECEIVE_USER, res.data)
        commit(types.ONLINE)
        commit(types.INFO, {
            message: '欢迎回来'
        })
    })
}

export const updateUser = ({ commit, state }) => {
    return User.update(state.user.user).then(() => {
        commit(types.UPDATE_USERNAME, state.user.user.username)
        commit(types.INFO, {
            message: '修改成功'
        })
    })
}

// Global

export const authenticate = ({ commit, state }) => {
    if (!tools.validateEmail(state.global.auth.email)) {
        commit(types.ERROR, {
            message: '请输入正确的邮箱'
        })
    } else if (!tools.validatePassword(state.global.auth.password)) {
        commit(types.ERROR, {
            message: '密码不符合要求 /\\w{6,18}/ '
        })
    } else {
        commit(types.INFO, {
            message: '登录中...',
            timeout: 10000
        })
        return Vue.http.post('/auth/login', {
            email:    state.global.auth.email,
            password: state.global.auth.password
        }).then(() => User.get().then(res => {
            commit(types.RECEIVE_USER, res.data)
            commit(types.ONLINE)
            commit(types.SET_INFO_TIMEOUT, null)
            router.replace('/')
        }))
    }
}

export const register = ({ commit, state }) => {
    if (!tools.validateEmail(state.global.auth.email)) {
        commit(types.ERROR, {
            message: '请输入正确的邮箱'
        })
    } else if (!tools.validatePassword(state.global.auth.password)) {
        commit(types.ERROR, {
            message: '密码不符合要求 /\\w{6,18}/ '
        })
    } else {
        commit(types.INFO, {
            message: '注册中...',
            timeout: 10000
        })
        return Vue.http.post('/auth/register', {
            email:    state.global.auth.email,
            password: state.global.auth.password
        }).then(() => User.get().then(res => {
            commit(types.RECEIVE_USER, res.data)
            commit(types.ONLINE)
            commit(types.SET_INFO_TIMEOUT, null)
            router.replace('/')
        }))
    }
}
