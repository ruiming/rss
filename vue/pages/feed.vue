<template>
<div id="feed">
    <headbar>订阅源</headbar>
    <div class="center">
        <div class="feed-header">
            <img :src="feed.favicon">
            <h1>{{feed.title}}</h1>
        </div>
        <div class="panel">
            <div class="row">
                <p class="col-xs-4">标题</p>
                <p class="col-xs-8">{{feed.title}}</p>
            </div>
            <div class="row" v-if="feed.author">
                <p class="col-xs-4">作者</p>
                <p class="col-xs-8">{{feed.author}}</p>
            </div>
            <div class="row" v-if="feed.pubdate">
                <p class="col-xs-4">最近更新</p>
                <p class="col-xs-8">{{feed.pubdate}}</p>
            </div>
            <div class="row">
                <p class="col-xs-4">订阅人数</p>
                <p class="col-xs-8">{{feed.feedNum}}</p>
            </div>
            <div class="row">
                <p class="col-xs-4">订阅源网站</p>
                <p class="col-xs-8">{{feed.link}}</p>
            </div>
        </div>
        <ul class="list-group">
            <template v-for="post in posts">
            <li class="list-group-item">
                <router-link :to="{name: 'post', params: {id: post._id}}" class="info">
                    <p>{{post.title}}</p>
                </router-link>
            </li>
            </template>
        </ul>
    </div>
    <navbar></navbar>
</div>
</template>

<script>
import { Feed, Posts } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
export default {
    data() {
        return {
            feed: {},
            posts: []
        }
    },
    mounted: function() {
        Feed.get({id: this.$route.params.id}).then(response => this.feed = response.data.data);
        Posts.get({feed_id: this.$route.params.id}).then(response => {
            this.posts = response.data.data.posts;
            this.status = _.groupBy(response.data.data.detail, 'post_id');
        });
    },
    components: {
        headbar, navbar
    }
}
</script>

<style lang="sass">
.panel {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 0;
}
.feed-header {
    position: relative;
    height: 53px;
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    h1 {
        margin: 15px 0 15px 50px;
    }
    img {
        position: absolute;
        top: 12px;
        left: 10px;
        width: 30px;
        height: 30px;
    }
}
#feed {
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
}
</style>