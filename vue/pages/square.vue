<template>
<div id="square">
    <headbar>广场</headbar>
    <div class="center">
        <div class="form-group">
            <div class="input-group search">
                <input type="text" class="form-control" placeholder="搜索订阅源">
                <div class="input-group-addon">
                    <span class="icon-search"></span>
                </div>
            </div>
        </div>
    </div>
    <navbar></navbar>
</div>
</template>

<script>
import { Posts, Post } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import _ from 'underscore';
export default {
    data() {
        return {
            posts: []
        }
    },
    methods: {

    },
    mounted: function() {

    },
    components: {
        headbar, navbar
    }
}
</script>

<style lang="sass">
#square {
    .search {
        padding: 5px 10px;
        background-color: #e8eaf6;
        .input-group-addon {
            background-color: white;
        }
    }
}
</style>