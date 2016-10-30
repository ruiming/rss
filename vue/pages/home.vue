<template>
<div id="home">
    <headbar>未读</headbar>
    <empty v-if="!posts.length">没有未读文章</empty>
    <ul class="list-group center">
        <template v-for="post in posts">
        <li class="list-group-item">
            <router-link :to="{name: 'feed', params: {id: post.feed_id}}" class="info">
                <img class="favicon" :src="post.favicon" onerror="this.src='/img/rss.png';">
                <p>{{post.feed_title}}<small>{{post.unread}} 篇未读</small></p>
            </router-link>
            <router-link :to="{name: 'post', params: {id: post._id}}" class="context">
                <div class="title">
                    <p>{{post.title}}</p>
                    <small>{{post.pubdate}}</small>
                </div>
                <p class="summary">{{post.summary}}</p>
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
import empty from '../components/empty.vue';
import _ from 'underscore';
import timeago from 'timeago.js';
export default {
    data() {
        return {
            posts: []
        }
    },
    beforeRouteEnter: function(to, from, next) {
        Posts.recent().then(response => next(vm => {
            for(let post of response.data.data) {
                if(post.pubdate !== null) {
                    post.pubdate = new timeago().format(post.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN');
                }
            }
            vm.posts = response.data.data;
        }));
    },
    components: {
        headbar, navbar, empty
    }
}
</script>

<style lang="sass">
#home {
    font-size: 14px;
    a {
        display: block;
        position: relative;
        .title {
            position: relative;
            height: 20px;
            p {
                position: absolute;
                right: 80px;
                left: 0;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            small {
                width: 80px;
                position: absolute;
                text-align: right;
                right: 0;
            }
        }
    }
    ul {
        p {
            overflow: hidden;
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
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
    }
}
</style>