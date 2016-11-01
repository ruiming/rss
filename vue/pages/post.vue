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
            <article v-html="post.description" class="article"></article>
        </section>
    </article>
    <postOption v-bind:post="post" v-bind:status="status" v-bind:pre="pre" v-bind:next="next"></postOption>
</div>
</template>

<script>
import { Post } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import postOption from '../components/post-option.vue'
import timeago from 'timeago.js'
import store from '../store'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        post: 'post',
        status: 'status',
        pre: 'pre',
        next: 'next'
    }),

    // TODO
    async beforeRouteEnter (to, from, next) {
        await store.dispatch('getPost', to.params.id)
        await store.dispatch('read')
        next()
    },

    watch: {
        '$route' (to, from) {
            store.dispatch('getPost', to.params.id)
                .then(() => store.dispatch('read'))
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