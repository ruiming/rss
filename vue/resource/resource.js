import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

const Feeds = Vue.resource('/api/feeds', {}, {
    popular: {
        method: 'GET',
        params: {
            order:      'feedNum',
            'per_page': 50
        }
    }
})

const Feed = Vue.resource('/api/feed{/id}', {}, {
    search: {
        method: 'POST',
        params: {
            search: true
        }
    }
})

const Post = Vue.resource('/api/post{/id}', {}, {
    update: {
        method: 'PUT'
    }
})

const Posts = Vue.resource('/api/posts', {}, {
    get: {
        method: 'GET',
        params: {
            type:    '@type',
            feed_id: '@feed_id'
        }
    },
    recent: {
        method: 'GET',
        url:    '/api/posts/recent'
    },
    update: {
        method: 'PUT'
    }
})

const User = Vue.resource('/api/user', {}, {
    update: {
        method: 'PUT'
    },
    logout: {
        method: 'POST',
        url:    '/auth/logout'
    }
})

export {
    Feeds,
    Feed,
    Post,
    Posts,
    User
}
