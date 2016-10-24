<template>
<div id="home">
    <headbar>未读文章</headbar>
    <ul class="list-group">
        <template v-for="post in posts">
        <li class="list-group-item">
            <div class="info">
                <img class="favicon" :src="post.favicon">
                <p>{{post.feed_title}}<small>{{post.unread}}</small></p>
            </div>
            <div class="context">
                <p>{{post.title}}<small>{{post.pubdate}}</small></p>
                <p class="summary">{{post.summary}}</p>
            </div>
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
        Posts.recent().then(response => this.posts = response.data.data);
    },
    components: {
        headbar, navbar
    }
}
</script>

<style lang="sass">
#home {
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