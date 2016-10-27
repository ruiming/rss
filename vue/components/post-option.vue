<template>
<div class="bottom">
    <ul class="list-group">
        <!-- id not defined when initial -->
        <router-link :to="{name: 'post', params: {id: pre||post._id||0}}" replace class="list-group-item">
            <span class="icon-arrow-left"><small>上一篇</small></span>
        </router-link>
        <li class="list-group-item" v-on:click="mark(post)">
            <span v-bind:class="{'icon-star-empty': !smark, 'icon-star-full': smark}"><small>收藏</small></span>
        </li>
        <li class="list-group-item" v-on:click="love(post)">
            <span v-bind:class="{'icon-smile': !slove, 'icon-smile2': slove}"><small>点赞</small></span>
        </li>
        <router-link :to="{name: 'post', params: {id: next||post._id||0}}" replace class="list-group-item">
            <span class="icon-arrow-right"><small>下一篇</small></span>
        </router-link>
    </ul>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js';
import _ from 'underscore';
export default {
    props: ['post', 'status', 'pre', 'next'],
    methods: {
        mark: function(post) {
            this.status.mark = !this.smark;
            Post.update({id: post._id}, {type: 'mark', revert: true});
        },
        love: function(post) {
            this.status.love = !this.slove;
            Post.update({id: post._id}, {type: 'love', revert: true});
        }
    },
    computed: {
        smark: function() {
            return this.status === null ? false : this.status.mark;
        },
        slove: function() {
            return this.status === null ? false : this.status.love;
        }
    }
}
</script>

<style lang="sass">

</style>