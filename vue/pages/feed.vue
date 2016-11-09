<template>
<div>
    <headbar>订阅源</headbar>
    <div class="center" id="feed">
        <div class="feed-header" v-bind:class="{expand2: expand}">
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
        <ul class="list-group" v-infinite-scroll="loadMore" 
            infinite-scroll-distance="10">
            <template v-for="post in posts">
            <li class="list-group-item" :key="post._id">
                <router-link :to="{name: 'post', params: {id: post._id}}" class="info">
                    <p v-bind:class="{'unread': !post.read}">{{post.title}}</p>
                    <small>{{post.pubdate}}</small>
                </router-link>
            </li>
            </template>
        </ul>
    </div>
    <feedOption></feedOption>
</div>
</template>

<script>
import { Feed, Posts } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import navbar from '../components/navbar.vue'
import feedOption from '../components/feed-option.vue'
import { mapGetters, mapActions } from 'vuex'
import store from '../store'
export default {
    computed: mapGetters({
        feed: 'feed',
        posts: 'feedPosts',
        expand: 'expand',
        end: 'end'
    }),

    data: function() {
        return {
            busy: false,
            page: 0
        }
    },

    methods: {
        loadMore: async function() {
            if(this.end) {
                return
            } else {
                this.busy = true
                await store.dispatch('getFeedPosts', {
                    id: this.$route.params.id,
                    page: ++this.page
                })
                this.busy = false
            }
        }
    },

    async beforeRouteEnter (to, from, next) {
        await Promise.all([
            store.dispatch('getFeed', to.params.id),
            store.dispatch('getFeedPosts', {
                id: to.params.id,
                page: 0
            })
        ])
        next()
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
    transition: 0.3s linear all;
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
            color: #9e9e9e;
            &:before {
                content: '    ';
            }
        }
        .unread {
            color: #333;
        }
        .unread:before {
            content: ' \B7 ';
            color: #3f51b5;
            font-weight: 900;
        }
        p+small {
            color: #9e9e9e;
            position: absolute;
            text-align: right;
            right: 10px;
            width: 85px;
        }
        .unread+small {
            color: #333;
        }
    }
}
</style>
