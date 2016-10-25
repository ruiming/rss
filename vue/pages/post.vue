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
    <navbar></navbar>
</div>
</template>

<script>
import { Post } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
export default {
    data() {
        return {
            post: []
        }
    },
    mounted: function() {
        Post.get({id: this.$route.params.id}).then(response => {
            this.post = response.data.data.result;
            this.status = response.data.data.detail;
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
    components: {
        headbar, navbar
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
        padding-top: 0;
    }
}
</style>