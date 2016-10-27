<template>
<div>
    <headbar>登录</headbar>
    <form v-on:submit.prevent="login(user)" class="center login">
        <msg :msgs="error"></msg>
        <img src="/img/rss.png">
        <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" class="form-control" id="email" v-model="user.email" placeholder="邮箱" required>
        </div>
        <div class="form-group">
            <label for="password">密码</label>
            <input type="password" class="form-control" id="password" v-model="user.password" placeholder="密码" required>
        </div>
        <input type="submit" class="btn btn-default btn-block" value="登录">        
        <router-link :to="{name: 'register'}" class="btn btn-default btn-block">没有账号? 注册</router-link>
    </form>
</div>
</template>

<script>
import { User } from '../resource/resource.js';
import msg from '../components/msg.vue';
import headbar from '../components/headbar.vue';
export default {
    data() {
        return {
            user: {email: '', password: ''},
            error: []
        }
    },
    beforeRouteEnter: function(to, from, next) {
        return User.get().then(res => next(vm =>
            vm.$router.back()
        ), err => next());
    },
    methods: {
        login: function(user) {
            this.error.length = 0;
            this.$http.post('/auth/login', user).then(response => {
                this.$router.replace('/');
            }, err => {
                this.error.push(err.data.message);
            })
        }
    },
    components: {
        msg, headbar
    }
}
</script>

<style lang="sass">
.login {
    padding: 10px 20px;
    img {
        display: block;
        margin: 20px auto;
        height: 100px;
        border-bottom: 1px solid #ddd;
    }
}
</style>