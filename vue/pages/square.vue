<template>
<div id="square">
    <headbar>广场</headbar>
    <div class="center">
        <div class="form-group search">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="搜索订阅源">
                <div class="input-group-addon">
                    <span class="icon-search"></span>
                </div>
            </div>
        </div>
        <ul class="list-group feed-group">
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
import { Feeds } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import _ from 'underscore';
export default {
    data() {
        return {
            feeds: []
        }
    },
    methods: {

    },
    beforeRouteEnter: function(to, from, next) {
        Feeds.popular({page: 0}).then(response => next(vm => vm.feeds = response.data.data));
    },
    components: {
        headbar, navbar
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