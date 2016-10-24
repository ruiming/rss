<template>
<div id="post">
    <headbar>文章</headbar>
    <article class="markdown-body center">
        <header>
            <h1>{{post.title}}</h1>
        </header>
        <section>
            <article v-html="post.description"></article>
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
    components: {
        headbar, navbar
    }
}
</script>

<style lang="sass">
#feeds {
    font-size: 14px;
    .feed-group {
        font-weight: 500;
        p {
            margin-bottom: 0;
        }
        small {
            line-height: 1.7;
            float: right;
        }
        .list-group-item {
            padding: 12px 15px;
        }
    }
}
</style>