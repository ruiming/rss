<template>
<div>
    <headbar>登录</headbar>
    <form v-on:submit.prevent="login()" class="center login">
        <img src="/img/rss.png">
        <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" class="form-control" id="email" 
                :value="auth.email" placeholder="邮箱" @input="inputEmail">
        </div>
        <div class="form-group">
            <label for="password">密码</label>
            <input type="password" class="form-control" id="password" 
                :value="auth.password" placeholder="密码" @input="inputPassword">
        </div>
        <input type="submit" class="btn btn-default btn-block" value="登录">        
        <router-link :to="{name: 'register'}" class="btn btn-default btn-block">没有账号? 注册</router-link>
    </form>
</div>
</template>

<script>
import headbar from '../components/headbar.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        error: 'error',
        auth: 'auth'
    }),

    methods: {
        ...mapActions({
            login: 'authenticate',
        }),
        inputEmail(e) {
            this.$store.commit('INPUT_EMAIL', e.target.value)
        },
        inputPassword(e) {
            this.$store.commit('INPUT_PASSWORD', e.target.value)
        }
    },
    
    components: {
        headbar
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