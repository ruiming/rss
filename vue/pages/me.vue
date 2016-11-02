<template>
<div class="me">
    <headbar>个人信息</headbar>
    <form @submit.prevent="updateUser()" class="center container-fluid">
        <msg :msgs="message"></msg>
        <div class="form-group">
            <label for="name">昵称: </label>
            <input type="text" :value="user.username" @input="inputUsername" class="form-control" id="name" placeholder="昵称">
        </div>
        <button type="submit" class="btn btn-default" @submit="updateUser">提交</button>
    </form>
    <navbar></navbar>
</div>
</template>

<script>
import { User } from '../resource/resource.js'
import headbar from '../components/headbar.vue'
import navbar from '../components/navbar.vue'
import _ from 'underscore'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        user: 'user',
        expand: 'expand',
        message: 'error'
    }),

    methods: {
        ...mapActions({
           updateUser: 'updateUser'
        }),
        inputUsername(e) {
            this.$store.commit('INPUT_USERNAME', e.target.value)
        }
    },
    
    components: {
        headbar, navbar
    }
}
</script>

<style lang="sass">
.me {
    padding: 15px 0;
}
</style>