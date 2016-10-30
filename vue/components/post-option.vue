<template>
    <div class="bottom" v-bind:class="{expand2: expand}">
    <ul class="list-group post-option">
        <!-- id not defined when initial -->
        <router-link :to="{name: 'post', params: {id: pre||post._id||0}}" replace class="list-group-item">
            <span class="icon-arrow-left"><small>上一篇</small></span>
        </router-link>
        <li class="list-group-item" @click="mark(post)">
            <span v-bind:class="{'icon-star-empty': !smark, 'icon-star-full': smark}"><small>收藏</small></span>
        </li>
        <a :href="post.link" class="list-group-item">
            <span class="icon-safari"><small>原文</small></span>
        </a>
        <li class="list-group-item" @click="love(post)">
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
import bus from '../bus.js';
export default {
    props: ['post', 'status', 'pre', 'next'],
    data() {
        return {
            expand: false
        }
    },
    created: function() {
        bus.$on('EXPAND', status => this.expand = status);
    },
    methods: {
        mark: function(post) {
            if(this.status === null)    this.status = {};
            this.$set(this.status, 'mark', !this.smark);
            Post.update({
                id: post._id
            }, {
                type: 'mark', 
                revert: true
            });
        },
        love: function(post) {
            if(this.status === null)    this.status = {};
            this.$set(this.status, 'love', !this.slove);
            Post.update({
                id: post._id
            }, {
                type: 'love', 
                revert: true
            });
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
.post-option {
    li, a {
        width: 20% !important;
    }
}
</style>