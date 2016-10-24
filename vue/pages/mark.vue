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
        </li>
        </template>
    </ul>
    <navbar></navbar>
</div>
</template>

<script>
import { Posts } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import _ from 'underscore';
export default {
    data() {
        return {
            posts: []
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
    }
    a {
        display: block;
    }
    .info {
        font-weight: 500;
        padding: 12px 15px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
    }
    .context {
        padding: 10px 15px;
        border-bottom: 1px solid #ddd;
    }
    .summary {
        max-height: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>