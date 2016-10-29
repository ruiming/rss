<template>
    <div id="head" v-bind:class="{expand2: expand}">
    <header>
        <span class="icon-paragraph-left" v-on:click="move()" ></span>
        <h2><slot>主页</slot></h2>
    </header>
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
</style>
