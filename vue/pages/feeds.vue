<template>
<div id="feeds">
    <headbar>订阅源</headbar>
    <empty v-if="!feeds.length">还没有订阅源</empty>
    <div class="list-group feed-group center">
        <template v-for="feed in feeds">
        <router-link :to="{name: 'feed', params: {id: feed._id}}" class="list-group-item" :key=feed._id>
            <img class="favicon" :src="feed.favicon" onerror="this.src='/img/rss.png';">
            <p>{{feed.title}}</p>
            <small v-if="feed.unread">{{feed.unread}} 篇未读</small>
        </router-link>
        </template>
    </div>
    <navbar></navbar>
</div>
</template>

<script>
import { Feed } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import navbar from '../components/navbar.vue'
import empty from '../components/empty.vue'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
    computed: mapGetters({
        feeds: 'userFeeds'
    }),

    async beforeRouteEnter(to, from, next) {
        if (!store.getters.prefetch.userfeeds) {
            await store.dispatch('getAllFeeds')
            store.commit('PREFETCH', {
                type: 'userfeeds', 
                status: true
            })
        }
        next()
    },
    
    components: {
        headbar, navbar, empty
    }
}
</script>

<style lang="sass">
.feed-group {
    font-size: 14px;
    font-weight: 500;
    p {
        margin-bottom: 0;
        position: absolute;
        left: 50px;
        right: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    small {
        line-height: 1.7;
        float: right;
        right: 0;
    }
    .list-group-item {
        height: 46px;
        position: relative;
        color: #333;
        padding: 12px 10px 12px 15px;
        border-left: 0;
        border-right: 0;
        border-radius: 0;
    }
}
</style>