<template>
<div id="square">
    <keep-alive>
        <headbar>广场</headbar>
    </keep-alive>
    <div class="center">
        <div class="form-group search">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="订阅源链接" 
                    :value="url" @keyup.enter="search()" @input="updateUrl">
                <div class="input-group-addon" @click="search()">
                    <span class="icon-search"></span>
                </div>
            </div>
        </div>
        <search v-if="searching"></search>
        <ul class="list-group feed-group" v-if="!searching">
            <div class="header"><span class="icon-fire"></span>热门订阅源</div>
            <template v-for="feed in feeds">
                <router-link :to="{name: 'feed', params: {id: feed._id}}" class="list-group-item">
                    <img class="favicon" :src="feed.favicon" onerror="this.src='/img/rss.png';">
                    <p>{{feed.title}}</p>
                    <small>{{feed.feedNum}} 人订阅</small>
                </router-link>
            </template>
        </ul>
    </div>
    <navbar></navbar>
</div>
</template>

<script>
import { Feeds, Feed } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import navbar from '../components/navbar.vue'
import search from '../components/search.vue'
import store from '../store'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        feeds: 'popularFeeds',
        searching: 'searching',        
        url: 'url',        
        err: 'error'
    }),

    async beforeRouteEnter(to, from, next) {
        if (!store.getters.prefetch.popularfeeds) {
            await store.dispatch('getPopularFeeds', 0)
            store.commit('PREFETCH', {
                type: 'popularfeeds', 
                status: true
            })
        }
        next()
    },

    methods: {
        ...mapActions(['search']),
        updateUrl(e) {
            this.$store.commit('UPDATE_URL', e.target.value)
        }
    },

    components: {
        headbar, navbar, search
    }
}
</script>

<style scoped>
.search {
    margin-bottom: 0;
    padding: 5px 10px;
    background-color: #e8eaf6;
    .input-group-addon {
        background-color: white;
    }
}
.header {
    font-size: 16px;
    padding: 10px 15px;
    span {
        color: #d81b60;
        margin-right: 10px;
    }
}
.feed-group {
    font-size: 14px;
    margin-bottom: 0;
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