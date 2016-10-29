<template>
<div class="me">
    <headbar>个人信息</headbar>
    <form @submit.prevent="update()" class="center container-fluid">
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
export default {
    data() {
        return {
            message: [],
            expand: false,
            user: {
                username: ''
            }
        }
    },
    created: function() {
        bus.$on('EXPAND', status => this.expand = status);
    },
    methods: {
        update: function() {
            User.update(this.user).then(res => {
                this.message = ['修改成功'];
                setTimeout(() => this.message = [], 1500);
            }, err => {
                this.message = [err.data.data];
            });
        }
    },
    beforeCreate: function() {
        bus.$on('USER', data => this.user = data);
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