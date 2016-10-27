<template>
<div class="bottom feed-option">
    <ul class="list-group">
        <!-- id not defined when initial -->
        <li class="list-group-item" v-on:click="mark()">
            <span v-bind:class="{'icon-checkmark2': !read, 'icon-checkmark': read}"><small>收藏</small></span>
        </li>
        <li class="list-group-item" v-on:click="mark()">
            <span v-bind:class="{'icon-eye': !feeded, 'icon-eye-blocked': feeded}"><small>收藏</small></span>
        </li>
    </ul>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js';
import _ from 'underscore';
export default {
    props: ['posts', 'feed'],
    methods: {
        mark: function(post) {
        },
        love: function(status) {
        }
    },
    computed: {
        read: function() {
            return this.feed.unread === 0;
        },
        feeded: function() {
            return this.feed.feed_time === undefined;
        }
    }
}
</script>

<style lang="sass">
.feed-option a,
.feed-option li {
    width: 50%;
}
</style>