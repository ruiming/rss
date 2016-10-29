<template>
    <div class="bottom feed-option" v-bind:class="{expand2: expand}">
    <ul class="list-group">
        <!-- id not defined when initial -->
        <li class="list-group-item" v-on:click="readall(posts)">
            <span v-bind:class="{'icon-checkmark2': !read, 'icon-checkmark': read}">
                <small v-if="!read">全部标记已读</small>
                <small v-else>没有未读文章</small>
            </span>
        </li>
        <li class="list-group-item" v-on:click="feedit(feed)">
            <span v-bind:class="{'icon-eye': !feeded, 'icon-eye-blocked': feeded}">
                <small v-if="!feeded" >订阅</small>
                <small v-else>取消订阅</small>
            </span>
        </li>
    </ul>
</div>
</template>

<script>
import { Posts, Post, Feed } from '../resource/resource.js';
import bus from '../bus.js';
import _ from 'underscore';
export default {
    props: ['posts', 'feed'],
    data() {
        return {
            expand: false
        }
    },
    created: function() {
        bus.$on('EXPAND', status => this.expand = status );
    },
    methods: {
        readall: function(posts) {
            if(!this.read) {
                for(let post of posts) {
                    post.read = true;
                }
                this.$set(this.feed, 'unread', 0);
                Posts.update({
                    feed_id: this.feed.feed_id || this.feed._id, 
                    type: 'read'
                });
            } else {
                return;
            }
        },
        feedit: function(feed) {
            if(!this.feeded) {
                Feed.save({
                    feedlink: feed.absurl
                }).then(response => {
                    this.$set(this.feed, 'feed_time', Date.now());
                });
            } else {
                Feed.delete({
                    id: feed.feed_id || feed._id
                }).then(response => {
                    this.$set(this.feed, 'feed_time', undefined);
                });
            }
        }
    },
    computed: {
        read: function() {
            return this.feed.unread === 0;
        },
        feeded: function() {
            return this.feed.feed_time !== undefined;
        }
    }
}
</script>

<style lang="sass">
.feed-option a,
.feed-option li {
    width: 50% !important;
}
</style>
