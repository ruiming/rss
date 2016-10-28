<template>
    <div>
        <router-view class="view" v-bind:class="{expand: expand}"></router-view>
    </div>
</template>

<script>
import bus from './bus.js';
export default {
    data() {
        return {
            expand: false
        }
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
    transition: 0.3s linear all;
}
</style>
