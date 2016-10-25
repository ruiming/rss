<template>
<div id="mark">
    <headbar>星标文章</headbar>
    <ul class="list-group center">
        <template v-for="post in posts">
        <li class="list-group-item">
            <router-link :to="{name: 'post', params: {id: post._id}}" class="info">
                <img class="favicon" :src="post.favicon">
                <p>{{post.title}}</p>
            </router-link>
            <div class="option" v-on:click="mark(post)">
                <span v-bind:class="{'icon-star-empty': post.mark, 'icon-star-full': !post.mark}"></span>
            </div>
        </li>
        </template>
    </ul>
    <navbar></navbar>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import _ from 'underscore';
export default {
    data() {
        return {
            posts: []
        }
    },
    methods: {
        mark: function(post) {
            this.$set(post, 'mark', !post.mark);
            Post.update({id: post._id}, {type: 'mark', revert: true});
        }
    },
    mounted: function() {
        Posts.get({type: 'mark'}).then(response => this.posts = response.data.data);
    },
    components: {
        headbar, navbar
    }
}
</script>

<style lang="sass">
#mark {
    font-size: 14px;
    ul {
        p {
            margin-bottom: 0;
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
}
</style>