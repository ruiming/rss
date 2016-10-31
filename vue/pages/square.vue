<template>
<div id="square">
    <headbar>广场</headbar>
    <div class="center">
        <div class="form-group search">
            <div class="input-group">
                <input type="url" class="form-control" placeholder="搜索订阅源" v-model="url"@keyup.enter="search(url)" >
                <div class="input-group-addon" @click="search(url)">
                    <span class="icon-search"></span>
                </div>
            </div>
        </div>
        <search v-if="searching"></search>
        <msg v-bind:msgs="err" v-if="!searching"></msg>
        <ul class="list-group feed-group" v-if="!searching && !err.length">
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
import { Feeds, Feed } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import search from '../components/search.vue';
import msg from '../components/msg.vue';
import _ from 'underscore';
import tools from '../../helper/help';
import base64 from 'base64-url';
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        feeds: 'popularFeeds'
    }),
    data() {
        return {
            url: null,
            err: [],
            searching: false
        }
    },
    methods: mapActions({
        search: 'search'
    }),
    created() {
        this.$store.dispatch('getPopularFeeds', 0)
    },
    components: {
        headbar, navbar, search, msg
    }
}
</script>

<style lang="sass">
#square {
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
}
</style>