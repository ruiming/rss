<template>
    <div id="head" v-bind:class="{expand2: expand}">
    <header>
        <span class="icon-paragraph-left" v-on:click="move()" ></span>
        <h2><slot>主页</slot></h2>
    </header>
    <transition name="sidebar">
    <div class="sidebar" v-if="expand">
        <div class="user">
            <img :src="user.avatar">
            <small>{{user.username}}</small>
        </div>
    </div>
    </transition>
</div>
</template>

<script>
import { User } from '../resource/resource.js';
import bus from '../bus.js';
export default {
    data() {
        return {
            expand: false,
            user: {}
        }
    },
    mounted: function() {
        User.get().then(response => {
            this.user = response.data.data;
        });
    },
    methods: {
        move: function() {
            this.expand = !this.expand;
            bus.$emit('EXPAND', this.expand);
        }
    }
}
</script>

<style lang="sass">
#head {
    transition: 0.3s linear all;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    color: white;
    z-index: 10;
    header {
        padding: 10px 0;
        background-color: #3f51b5;
        border-bottom: 1px solid #3f51b5;
        height: 40px;
    }
    h2 {
        margin: 0;        
        font-size: 16px;
    }
    text-align: center;
    header {
        position: relative;
    }
    span {
        position: absolute;
        left: 15px;
        font-size: 18px;
    }
}
.sidebar {
    transition: 0.3s linear all;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    color: black;
    background-color: #fafafa;
    z-index: 100;
    width: 200px;
    .user {
        padding-top: 10px;
        padding-bottom: 20px;
        background-image: url('/img/userbg.jpg');
        img {
            height: 70px;
            width: 70px;
            border: 2px solid white;
            margin: 20px auto 15px;
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
