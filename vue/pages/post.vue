<template>
<div>
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
    <postOption></postOption>
</div>
</template>

<script>
import { Post } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import postOption from '../components/post-option.vue'
import store from '../store'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        post: 'post'
    }),

    // TODO
    async beforeRouteEnter (to, from, next) {
        await store.dispatch('getPost', to.params.id)
        await store.dispatch('read')
        next()
    },

    watch: {
        async '$route' (to, from) {
            await store.dispatch('getPost', to.params.id)
            window.scrollTo(0, 0)
            await store.dispatch('read')
        }
    },

    components: {
        headbar, postOption
    }
}
</script>

<style scoped>
.detail {
    padding: 5px 0 10px 0;
    font-size: 12px;
    span {
        display: block;
    }
}
.article {
    padding-top: 10px;
}
</style>