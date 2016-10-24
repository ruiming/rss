<template>
<div id="feeds">
    <headbar>订阅源</headbar>
    <div class="list-group feed-group center">
        <template v-for="(feed, folder) in feeds">
        <div class="list-group-item" v-if="folder !== 'default'">
            <img class="favicon" src="img/folder.png">
            <span class="title">{{folder}}</span>
        </div>
        <router-link :to="{name: 'feed', params: {id: fee.feed_id}}" class="list-group-item" v-for="fee in feed">
            <img class="favicon" :src="fee.favicon">
            <p>{{fee.title}}<small>{{fee.unread}}</p>
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
export default {
    data() {
        return {
            feeds: []
        }
    },
    mounted: function() {
        Feed.get().then(response => this.feeds = _.groupBy(response.data.data, 'folder'));
    },
    components: {
        headbar, navbar
    }
}
</script>

<style lang="sass">
#feeds {
    font-size: 14px;
    .feed-group {
        font-weight: 500;
        p {
            margin-bottom: 0;
        }
        small {
            line-height: 1.7;
            float: right;
        }
        .list-group-item {
            padding: 12px 15px;
        }
    }
}
</style>