<template>
    <div class="bottom feed-option" v-bind:class="{expand2: expand}">
    <ul class="list-group">
        <!-- id not defined when initial -->
        <li class="list-group-item" v-on:click="readall()">
            <span v-bind:class="{'icon-checkmark2': feed.unread, 'icon-checkmark': !feed.unread}">
                <small v-if="feed.unread">全部标记已读</small>
                <small v-else>没有未读文章</small>
            </span>
        </li>
        <li class="list-group-item" v-on:click="feed.feed_time ? unsubscribe() : subscribe()">
            <span v-bind:class="{'icon-eye': !feed.feed_time, 'icon-eye-blocked': feed.feed_time}">
                <small v-if="!feed.feed_time" >订阅</small>
                <small v-else>取消订阅</small>
            </span>
        </li>
    </ul>
</div>
</template>

<script>
import { Posts, Post, Feed } from '../resource/resource.js';
import _ from 'underscore';
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        posts: 'posts',
        feed: 'feed',
        expand: 'expand'
    }),
    methods: mapActions({
        readall: 'readAll',
        subscribe: 'subscribe',
        unsubscribe: 'unsubscribe'
    })
}
</script>

<style lang="sass">
.feed-option a,
.feed-option li {
    width: 50% !important;
}
</style>
