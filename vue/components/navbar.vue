<template>
    <div class="bottom" v-bind:class="{expand2: expand}">
    <ul class="list-group">
        <router-link :to="{name: 'home'}"><span class="icon-book"><small>未读</small></span></router-link>
        <router-link :to="{name: 'feeds'}"><span class="icon-folder"><small>订阅源</small></span></router-link>
        <router-link :to="{name: 'mark'}"><span class="icon-star-full"><small>收藏</small></span></router-link>
        <router-link :to="{name: 'square'}"><span class="icon-pacman"><small>广场</small></span></router-link>
    </ul>
</div>
</template>

<script>
import bus from '../bus.js';
export default {
    data() {
        return {
            expand: false
        }
    },
    created: function() {
        bus.$on('EXPAND', status => this.expand = status );
    }
}
</script>

<style lang="sass">

</style>