<template>
<div id="feeds">
    <headbar>订阅源</headbar>
    <empty v-if="!feeds.default">还没有订阅源</empty>
    <div class="list-group feed-group center">
        <template v-for="(feed, folder) in feeds">
        <div class="list-group-item" v-if="folder !== 'default'">
            <img class="favicon" src="img/folder.png" onerror="this.src='/img/rss.png';">
            <span class="title">{{folder}}</span>
        </div>
        <router-link :to="{name: 'feed', params: {id: fee.feed_id}}" class="list-group-item" v-for="fee in feed">
            <img class="favicon" :src="fee.favicon" onerror="this.src='/img/rss.png';">
            <p>{{fee.title}}</p>
            <small v-if="fee.unread">{{fee.unread}} 篇未读</small>
        </router-link>
        </template>
    </div>
    <navbar></navbar>
</div>
</template>

<script>
import { Feed } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import empty from '../components/empty.vue';
export default {
    data() {
        return {
            feeds: []
        }
    },
    beforeRouteEnter: function(to, from, next) {
        Feed.get().then(response => next(vm => vm.feeds = _.groupBy(response.data.data, 'folder')));
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
        left: 45px;
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