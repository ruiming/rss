import timeago from 'timeago.js'
import _ from 'underscore'

export const feed = state => {
    let feed = _.extend(state.feed.feed)
    if (feed.pubdate != null) {
        return _.extend({}, feed, { pubdate: new timeago().format(feed.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN') })
    }
    return feed
}

// User's feeds and popular feeds
export const userFeeds = state => _.groupBy(state.feeds.userfeeds, 'folder')

export const popularFeeds = state => state.feeds.feeds

export const posts = state => state.posts.posts

export const post = state => {
    let post = _.extend({}, state.post.post),
        re = /src="(\/[^\/].+?)"/g
    if (post.pubdate != null) {
        post.pubdate = new timeago().format(post.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN')
    }
    if (post.description) {
        post.description.replace(re, (match, p) => {
            return `src="${post.website}${p.slice(1)}"`
        })
    }
    return state.post.post
}

export const status = state => state.post.status

export const pre = state => state.post.pre

export const next = state => state.post.next

export const expand = state => state.global.expand

export const url = state => state.feed.url

export const searching = state => state.feed.searching

export const error = state => state.global.error

export const info = state => state.global.info

export const user = state => state.user.user

export const loading = state => state.global.loading

export const auth = state => state.global.auth

export const online = state => state.global.online

export const feedPosts = state => state.posts.feedPosts

export const recentPosts = state => state.posts.recentPosts

export const timer = state => state.global.timer
