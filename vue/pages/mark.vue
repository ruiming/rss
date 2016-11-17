<template>
<div id="mark">
    <headbar>收藏</headbar>
    <empty v-if="!posts.length">还没有收藏</empty>
    <ul class="list-group center">
        <template v-for="post in posts">
        <li class="list-group-item">
            <router-link :to="{name: 'post', params: {id: post._id}}" class="info">
                <img class="favicon" :src="post.favicon" onerror="this.src='/img/rss.png';">
                <p>{{post.title}}</p>
            </router-link>
            <div class="option" v-on:click="mark(post)">
                <span v-bind:class="{'icon-star-empty': !post.mark, 'icon-star-full': post.mark}"></span>
            </div>
        </li>
        </template>
    </ul>
    <navbar></navbar>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import navbar from '../components/navbar.vue'
import empty from '../components/empty.vue'
import _ from 'underscore'
import store from '../store'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        posts: 'posts'
    }),

    async beforeRouteEnter(to, from, next) {
        if (!store.getters.prefetch.markposts) {
            await store.dispatch('getPosts', 'mark')
            store.commit('PREFETCH', {
                type: 'markposts', 
                status: true
            })
        }
        next()
    },

    methods: mapActions({
        mark: 'mark'
    }),
    
    components: {
        headbar, navbar, empty
    }
}
</script>

<style scoped>
ul {
    p {
        margin-bottom: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    small {
        line-height: 1.7;
        float: right;
    }
}
li {
    padding: 0;   
    border: 0 none;
    border-radius: 0;
    position: relative;
    height: 46px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;     
}
a {
    display: block;
}
.info {
    font-weight: 500;
    padding: 12px 15px;
    right: 50px;
    left: 0;
    position: absolute;
}
.option {
    width: 50px;
    height: 46px;
    position: absolute;
    right: 0;
    display: table;
    color: #3f51b5;
    span {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
    }
}
</style>