<template>
    <div style="min-height:100%">
        <transition name="sidebar">
            <div class="sidebar" v-show="expand">
                <div class="user">
                    <img :src="user.avatar">
                    <small>{{user.username}}</small>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">
                        <span class="icon-user" @click="tome()">个人信息</span>
                    </li>
                    <li class="list-group-item" @click="logout()">
                        <span class="icon-rocket">退出登录</span>
                    </li>
                </ul>
            </div>
        </transition>
        <msg></msg>
        <router-view class="view" v-show="!loading" v-bind:class="{expand: expand}"></router-view>
        <div class="loading" v-show="loading">
            <div class="cssload-loader"></div>
            <p>加载中</p>
        </div>
    </div>
</template>

<script>
import { User } from './resource/resource.js'
import Cookies from 'js-cookie'
import { mapGetters, mapActions } from 'vuex'
import msg from './components/msg.vue'
import store from './store'
export default {
    computed: mapGetters({
        expand: 'expand',
        user: 'user',
        loading: 'loading'
    }),

    methods: {
        tome: function() {
            this.$router.push({name: 'me'})
        },
        logout: function() {
            store.commit('OFFLINE')
        }
    },
    
    mounted: function() {
        this.$store.dispatch('getUser')
    },

    components: {
        msg
    }
}
</script>

<style>
.loading {
    position: fixed;
    left: 0;
    right: 0;
    top: 40%;
    text-align: center;
    p {
        color: black;
        font-size: 12px;
        padding-top: 40px;
    }
}
h1 {
    font-size: 18px;
}
.view {
    position: relative;
    z-index: 100;
    background-color: white;
    transition: 0.3s linear all;
    min-height: 300px;
}
.sidebar {
    transition: 0.3s linear all;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    color: black;
    background-color: #fff;
    z-index: 50;
    width: 200px;
    ul {
        li, a {
            border-radius: 0;
            border- {
                bottom: 1px solid #eee;
                top: 1px solid #eee;
                left: 0;
                right: 0;
            }
        }
        span:before {
            margin-right: 15px;
        }
    }
    .user {
        padding-top: 10px;
        padding-bottom: 20px;
        text-align: center;
        background-image: url('/img/userbg.jpg');
        img {
            height: 70px;
            width: 70px;
            border: 2px solid white;
            margin: 20px auto 15px;
            text-align: center;
            border-radius: 50%;
        }
        small {
            color: white;
            display: block;
            font-size: 14px;
        }
    }
}
.sidebar-leave {
    transition: 0.3s linear all;
}
</style>