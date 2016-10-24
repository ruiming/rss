<template>
<div id="register">
    <h2>注册</h2>
    <form v-on:submit.prevent="register(user)">
        <msg :msgs="error"></msg>
        <div>
            <label for="email">邮箱</label>
            <input type="email" id="email" v-model="user.email">
        </div>
        <div>
            <label for="password">密码</label>
            <input type="password" id="password" v-model="user.password">
        </div>
        <div>
            <router-link :to="{name: 'login'}">登录</router-link>
        </div>
        <div>
            <input type="submit">
        </div>
    </form>
</div>
</template>

<script>
import msg from '../components/msg.vue'
export default {
    data() {
        return {
            user: {email: '', password: ''},
            error: []
        }
    },
    methods: {
        register: function(user) {
           this.$http.post('/auth/register', user).then(response => {
               this.$router.replace('/');
           }, err => {
               this.error.push(err.body.message);
           })
        }
    },
    components: {
        msg
    }
}
</script>

<style lang="sass">
</style>