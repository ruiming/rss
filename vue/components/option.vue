<template>
<div id="option">
    <ul class="list-group">
        <li class="list-group-item">上一篇</li>
        <li class="list-group-item" v-on:click="mark(post)">
            <span class="glyphicon" v-bind:class="{'glyphicon-star-empty': post.mark, 'glyphicon-star': !post.mark}"></span>
        </li>
        <li class="list-group-item">点赞</li>
        <li class="list-group-item">下一篇</li>
    </ul>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js';
import _ from 'underscore';
export default {
    props: ['post', 'status'],
    methods: {
        mark: function(post) {
            this.$set(post, 'mark', !post.mark);
            Post.update({id: post._id}, {type: 'mark', revert: true});
        }
    },
    mounted: function() {
        Posts.get({type: 'mark'}).then(response => this.posts = response.data.data);
    }
}
</script>

<style lang="sass">
#option {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    ul {
        box-sizing: border-box;
        overflow: hidden;
        margin-bottom: 0;
        border-top: 1px solid #ddd;
    }
    li {
        box-sizing: border-box;
        text-align: center;
        width: 25%;
        float: left;
        border: 0 none;
        border-radius: 0;
        border-right: 1px solid #ddd;
        &:last-child {
            border-right: 1px solid #ddd;
        }
    }
}
</style>