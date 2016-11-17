<template>
    <div class="bottom" v-bind:class="{expand2: expand}">
    <ul class="list-group post-option">
        <router-link :to="{name: 'post', params: {id: post.pre || post._id}}" replace class="list-group-item">
            <span class="icon-arrow-left"><small>上一篇</small></span>
        </router-link>
        <li class="list-group-item" @click="mark()">
            <span v-bind:class="{'icon-star-empty': !post.mark, 'icon-star-full': post.mark}"><small>收藏</small></span>
        </li>
        <a :href="post.link" class="list-group-item">
            <span class="icon-safari"><small>原文</small></span>
        </a>
        <li class="list-group-item" @click="love()">
            <span v-bind:class="{'icon-smile': !post.love, 'icon-smile2': post.love}"><small>点赞</small></span>
        </li>
        <router-link :to="{name: 'post', params: {id: post.next || post._id}}" replace class="list-group-item">
            <span class="icon-arrow-right"><small>下一篇</small></span>
        </router-link>
    </ul>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js'
import _ from 'underscore'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        post: 'post',
        expand: 'expand'
    }),
    
    methods: mapActions({
        mark: 'mark',
        love: 'love'
    })
}
</script>

<style scoped>
.post-option {
    li, a {
        width: 20% !important;
    }
}
</style>