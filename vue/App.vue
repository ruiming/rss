<template>
    <div style="height:calc(100% + 84px); overflow-x:hidden">
    <transition name="sidebar">
    <div class="sidebar" >
        <div class="user">
            <img :src="user.avatar">
            <small>{{user.username}}</small>
        </div>
    </div>
    </transition>
        <router-view class="view" v-bind:class="{expand: expand}"></router-view>
    </div>
</template>

<script>
import { User } from './resource/resource.js';
import bus from './bus.js';
export default {
    data() {
        return {
            expand: false,
            user: {}
        }
    },
    mounted: function() {
        User.get().then(response => this.user = response.data.data );
    },
    created: function() {
        bus.$on('EXPAND', status => {
            this.expand = status;
        });
    }
}
</script>

<style lang="sass">
h1 {
    font-size: 18px;
}

.view {
    min-height: 100%;
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
    z-index: -100;
    width: 200px;
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
.sidebar-enter,
.sidebar-leave-active {
    width: 0;
    transition: 0.3s linear all;
    img {
        width: 0 !important;
        height: 0 !important;
        transition: 0.3s linear all;
    }
}
</style>
