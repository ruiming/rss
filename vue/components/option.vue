<template>
<div id="option">
    <ul class="list-group">
        <li class="list-group-item">
            <span class="icon-arrow-left"></span>
        </li>
        <li class="list-group-item" v-on:click="mark(status)">
            <span v-bind:class="{'icon-star-empty': !status.mark, 'icon-star-full': status.mark}"></span>
        </li>
        <li class="list-group-item" v-on:click="love(status)">
            <span v-bind:class="{'icon-smile': !status.love, 'icon-smile2': status.love}"></span>
        </li>
        <li class="list-group-item">
            <span class="icon-arrow-right"></span>
        </li>
    </ul>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js';
import _ from 'underscore';
export default {
    props: ['post', 'status'],
    methods: {
        mark: function(status) {
            this.$set(status, 'mark', !status.mark);
            Post.update({id: status.post_id}, {type: 'mark', revert: true});
        },
        love: function(status) {
            this.$set(status, 'love', !status.love);
            Post.update({id: status.post_id}, {type: 'love', revert: true});
        }
    }
}
</script>

<style lang="sass">
#option {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    color: #616161;
    font-family: 'icomoon' !important;
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