<template>
<div id="login">
    <h2>登录</h2>
    <form v-on:submit.prevent="login(user)">
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
            <router-link :to="{name: 'register'}">注册</router-link>
        </div>
        <div>
            <input type="submit">
        </div>
    </form>
</div>
</template>

<script>
import msg from '../components/msg.vue';
export default {
    data() {
        return {
            user: {email: '', password: ''},
            error: []
        }
    },
    methods: {
        login: function(user) {
           this.$http.post('/auth/login', user).then(response => {
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