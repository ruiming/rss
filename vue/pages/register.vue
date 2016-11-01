<template>
<div>
    <headbar>注册</headbar>
    <form v-on:submit.prevent="register()" class="center login">
        <msg></msg>
        <img src="/img/rss.png">
        <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" class="form-control" id="email" :value="auth.email" @input="inputEmail" placeholder="邮箱" required>
        </div>
        <div class="form-group">
            <label for="password">密码</label>
            <input type="password" class="form-control" id="password" :value="auth.password" @input="inputPassword" placeholder="密码" required>
        </div>
        <input type="submit" class="btn btn-default btn-block" value="注册">        
        <router-link :to="{name: 'login'}" class="btn btn-default btn-block">已有账号? 登录</router-link>
    </form>
</div>
</template>

<script>
import { User } from '../resource/resource.js'
import msg from '../components/msg.vue'
import headbar from '../components/headbar.vue'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        error: 'error',
        auth: 'auth'
    }),

    methods: {
        ...mapActions({
            register: 'register'
        }),
        inputEmail(e) {
            this.$store.commit('INPUT_EMAIL', e.target.value)
        },
        inputPassword(e) {
            this.$store.commit('INPUT_PASSWORD', e.target.value)
        }
    },
    
    components: {
        msg, headbar
    }
}
</script>

<style lang="sass">
.register {
    padding: 10px 20px;
    img {
        display: block;
        margin: 20px auto;
        height: 100px;
        border-bottom: 1px solid #ddd;
    }
}
</style>