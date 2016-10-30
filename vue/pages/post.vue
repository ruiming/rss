<template>
<div id="post">
    <headbar>文章</headbar>
    <article class="markdown-body center">
        <header>
            <h1>{{post.title}}</h1>
        </header>
        <section class="detail">
            <span v-if="post.pubdate">更新于 {{post.pubdate}} </span>
            <span v-if="post.author">由 {{post.author}} 发布</span>
        </section>
        <section>
            <article v-html="content" class="article"></article>
        </section>
    </article>
    <postOption v-bind:post="post" v-bind:status="status" v-bind:pre="pre" v-bind:next="next"></postOption>
</div>
</template>

<script>
import { Post } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import postOption from '../components/post-option.vue';
import timeago from 'timeago.js';
export default {
    data() {
        return {
            post: {},
            status: {},
            pre: 0,
            next: 0
        }
    },
    mounted: function() {
        Post.get({
            id: this.$route.params.id
        }).then(response => {
            this.post = response.data.data.result;
            if(this.post.pubdate !== null) {
                this.post.pubdate = new timeago().format(this.post.pubdate.split('').splice(0, 19).join('').replace('T', ' '), 'zh_CN');                
            }
            this.status = response.data.data.detail;
            this.pre = response.data.data.pre;
            this.next = response.data.data.next;
            if(this.status === null || this.status.read === false) {
                Post.update({id: this.post._id}, {type: 'read'});
            }
        });
    },
    computed: {
        content: function() {
            let re = /src="(\/[^\/].+?)"/g;
            if(this.post.description) {
                return this.post.description.replace(re, (match, p, offset, string) => {
                    return `src="${this.post.website}${p.slice(1)}"`;
                });
            }
            return;
        }
    },
    watch: {
        '$route' (to, from) {
            return Post.get({
                id: this.$route.params.id
            }).then(response => {
                this.post = response.data.data.result;
                this.status = response.data.data.detail;
                this.pre = response.data.data.pre;
                this.next = response.data.data.next;
                if(this.status === null || this.status.read === false) {
                    Post.update({id: this.post._id}, {type: 'read'});
                }
            });
        }
    },
    components: {
        headbar, postOption
    }
}
</script>

<style lang="sass">
#post {
    p {
        font-size: 14px;
    }
    h1 {
        margin-top: 18px;
        word-break: break-all;
        padding-bottom: 5px;
        border-bottom: 0;
    }
    .detail {
        span {
            display: block;
        }
        padding: 5px 0 10px 0;
        font-size: 12px;
    }
    .article {
        padding-top: 10px;
    }
}
</style>