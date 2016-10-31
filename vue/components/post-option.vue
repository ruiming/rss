<template>
    <div class="bottom" v-bind:class="{expand2: expand}">
    <ul class="list-group post-option">
        <!-- id not defined when initial -->
        <router-link :to="{name: 'post', params: {id: pre||post._id||0}}" replace class="list-group-item">
            <span class="icon-arrow-left"><small>上一篇</small></span>
        </router-link>
        <li class="list-group-item" @click="mark()">
            <span v-bind:class="{'icon-star-empty': !status.mark, 'icon-star-full': status.mark}"><small>收藏</small></span>
        </li>
        <a :href="post.link" class="list-group-item">
            <span class="icon-safari"><small>原文</small></span>
        </a>
        <li class="list-group-item" @click="love()">
            <span v-bind:class="{'icon-smile': !status.love, 'icon-smile2': status.love}"><small>点赞</small></span>
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
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        post: 'post',
        status: 'status',
        pre: 'pre',
        next: 'next',
        expand: 'expand'
    }),
    methods: mapActions({
        mark: 'mark',
        love: 'love'
    })
}
</script>

<style lang="sass">
.post-option {
    li, a {
        width: 20% !important;
    }
}
</style>