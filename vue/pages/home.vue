<template>
<div id="home">
    <headbar>未读</headbar>
    <empty v-if="!posts.length">没有未读文章</empty>
    <ul class="list-group center">
        <template v-for="post in posts">
        <li class="list-group-item" v-if="post.unread">
            <router-link :to="{name: 'feed', params: {id: post.feed_id}}" class="info">
                <img class="favicon" :src="post.favicon" onerror="this.src='/img/rss.png';">
                <p>{{post.feed_title}}</p>
                <small>{{post.unread}} 篇未读</small>
            </router-link>
            <router-link :to="{name: 'post', params: {id: post._id}}" class="context">
                <div class="title">
                    <p>{{post.title}}</p>
                    <small>{{post.pubdate}}</small>
                </div>
                <p class="summary">{{post.summary}}</p>
            </router-link>
        </li>
        </template>
    </ul>
    <navbar></navbar>
</div>
</template>

<script>
import { Posts } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import navbar from '../components/navbar.vue'
import empty from '../components/empty.vue'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
    computed: mapGetters({
        posts: 'recentPosts'
    }),

    async beforeRouteEnter (to, from, next) {
        if(!store.getters.prefetch.recentposts) {
            await store.dispatch('getRecentPosts')
            store.commit('PREFETCH', {
                type: 'recentposts',
                status: true
            })
        }
        next()
    },

    // Prefetch all main data in the home page
    mounted: function() {
        let { userfeeds, markposts, popularfeeds } = store.getters.prefetch
        if (!userfeeds) {
            store.dispatch('getAllFeeds')
            store.commit('PREFETCH', {
                type: 'userfeeds',
                status: true
            })
        }
        if (!markposts) {
            store.dispatch('getPosts', 'mark')
            store.commit('PREFETCH', {
                type: 'markposts', 
                status: true
            })
        }
        if (!popularfeeds) {
            store.dispatch('getPopularFeeds', 0)
            store.commit('PREFETCH', {
                type: 'popularfeeds', 
                status: true
            })
        }
    },
    
    components: {
        headbar, navbar, empty
    }
}
</script>

<style scoped>
a {
    display: block;
    position: relative;
    .title {
        position: relative;
        height: 20px;
        p {
            position: absolute;
            right: 80px;
            left: 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        small {
            width: 80px;
            position: absolute;
            text-align: right;
            top: 0;
            right: 0;
        }
    }
}
ul {
    p {
        overflow: hidden;
        margin-bottom: 0;
    }
    small {
        line-height: 1.7;
        float: right;
    }
}
li {
    padding: 0;
    border: 0 none;
    &:last-child {
        border-bottom: 1px solid #ddd;
    }
}
.info {
    font-weight: 500;
    padding: 12px 15px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    position: relative;
    height: 46px;
    small {
        position: absolute;
        right: 15px;
        top: 12px;
    }
    p {
        position: absolute;
        left: 50px;
        right: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
.context {
    padding: 10px 15px;
}
.summary {
    max-height: 140px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>