<template>
    <div style="height:calc(100% + 83px); overflow-x:hidden">
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
        <router-view class="view" v-bind:class="{expand: expand}"></router-view>
    </div>
</template>

<script>
import { User } from './resource/resource.js';
import Cookies from 'js-cookie';
import bus from './bus.js';
export default {
    data() {
        return {
            expand: false,
            user: {}
        }
    },
    methods: {
        tome: function() {
            let user = this.user;
            setTimeout(() => bus.$emit('USER', user));
            this.$router.push({name: 'me'});
        },
        logout: function() {
            Cookies.remove('jwt');
            Cookies.remove('XSRF-TOKEN');
            this.$router.push({name: 'login'});
        }
    },
    mounted: function() {
        User.get().then(response => this.user = response.data.data );
    },
    created: function() {
        bus.$on('EXPAND', status => this.expand = status );
    }
}
</script>

<style lang="sass">
h1 {
    font-size: 18px;
}

.view {
    min-height: calc(100% - 83px);
    position: relative;
    z-index: 100;
    background-color: white;
    transition: 0.3s linear all;
}
.sidebar {
    transition: 0.3s linear all;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    color: black;
    background-color: #fafafa;
    z-index: 50;
    width: 200px;
    ul {
        li,
        a {
            border: {
                top: 1px solid #eee;
                bottom: 1px solid #eee;
                left: 0;
                right: 0;
            }
            border-radius: 0;
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
