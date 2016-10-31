<template>
<div class="me">
    <headbar>个人信息</headbar>
    <form @submit.prevent="updateUser()" class="center container-fluid">
        <msg :msgs="message"></msg>
        <div class="form-group">
            <label for="name">昵称: </label>
            <input type="text" v-model="user.username" class="form-control" id="name" placeholder="昵称">
        </div>
        <button type="submit" class="btn btn-default">提交</button>
    </form>
    <navbar></navbar>
</div>
</template>

<script>
import { User } from '../resource/resource.js';
import headbar from '../components/headbar.vue';
import navbar from '../components/navbar.vue';
import bus from '../bus.js';
import msg from '../components/msg.vue';
import _ from 'underscore';
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        user: 'user'
    }),
    methods: mapActions({
        updateUser: 'updateUser'
    }),
    data() {
        return {
            message: [],
            expand: false,
        }
    },
    beforeCreate: function() {
        bus.$on('USER', data => this.user = data);
    },
    created: function() {
        bus.$on('EXPAND', status => this.expand = status);
    },
    components: {
        headbar, msg, navbar
    }
}
</script>

<style lang="sass">
.me {
    padding: 15px 0;
}
</style>