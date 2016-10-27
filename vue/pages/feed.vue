<template>
<div>
    <headbar>订阅源</headbar>
    <div class="center" id="feed">
        <div class="feed-header">
            <img :src="feed.favicon" onerror="this.src='/img/rss.png';">
            <h1>{{feed.title}}<small v-if="feed.unread">{{feed.unread}}</small></h1>
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
                <p class="col-xs-8">{{feed.feedNum}} 人</p>
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
                    <p v-bind:class="{'unread': !post.read}">{{post.title}}</p>
                    <small>{{post.pubdate}}</small>
                </router-link>
            </li>
            </template>
        </ul>
    </div>
    <feedOption v-bind:feed="feed" v-bind:posts="posts"></feedOption>
</div>
</template>

<script>
import { Feed, Posts } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import feedOption from '../components/feed-option.vue';
import timeago from 'timeago.js'
export default {
    data() {
        return {
            feed: {},
            posts: []
        }
    },
    mounted: function() {
        Feed.get({id: this.$route.params.id}).then(response => {
            this.feed = response.data.data;
            this.feed.pubdate = new timeago().format(this.feed.pubdate.split('').splice(0, 19).join('').replace('T', ' '));
        });
        Posts.get({feed_id: this.$route.params.id}).then(response => {
            this.posts = response.data.data.posts;
            this.status = _.groupBy(response.data.data.detail, 'post_id');
            for(let post of this.posts) {
                post.pubdate = new timeago().format(post.pubdate.split('').splice(0, 19).join('').replace('T', ' '));
                if(this.status[post._id] && this.status[post._id][0].read) {
                    this.$set(post, 'read', true);
                } else {
                    this.$set(post, 'read', false);
                }
            }
        });
    },
    components: {
        headbar, feedOption
    }
}
</script>

<style lang="sass">
.panel {
    padding: 10px;
    border-bottom: 1px solid #ddd;
    margin-bottom: 0;
    margin-top: 53px;
}
.feed-header {
    position: fixed;
    top: 40px;
    left: 0;
    right: 0;
    z-index: 2;
    background-color: white;
    height: 53px;
    overflow: hidden;
    border-bottom: 1px solid #ddd;
    h1 {
        margin: 15px 0 15px 50px;
        small {
            float: right;
            padding: 4px 10px;
        }
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
        margin-bottom: 0;
        p {
            margin-bottom: 0;
            overflow: hidden;
            white-space: pre;
            text-overflow: ellipsis;
        }
        small {
            line-height: 1.7;
            float: right;
        }
    }
    li {
        padding: 0;
        border: 0 none;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        &:first-child {
            border-top: 0;
        }
    }
    .row:last-child p {
        margin-bottom: 0;
    }
    .info {
        display: block;
        position: relative;
        font-weight: 500;
        padding: 12px 15px;
        overflow: hidden;
        height: 45px;
        p {
            display: block;
            position: absolute;
            left: 5px;
            right: 90px;
            &:before {
                content: '    ';
            }
        }
        .unread:before {
            content: ' \B7 ';
            color: #3f51b5;
            font-weight: 900;
        }
        small {
            position: absolute;
            text-align: right;
            right: 10px;
            width: 85px;
        }
    }
}
</style>