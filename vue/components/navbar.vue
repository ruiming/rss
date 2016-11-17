<template>
    <div class="bottom" v-bind:class="{expand2: expand}">
    <ul class="list-group">
        <router-link :to="{name: 'home'}" exact><span class="icon-book"><small>未读</small></span></router-link>
        <router-link :to="{name: 'feeds'}"><span class="icon-folder"><small>订阅源</small></span></router-link>
        <router-link :to="{name: 'mark'}"><span class="icon-star-full"><small>收藏</small></span></router-link>
        <router-link :to="{name: 'square'}"><span class="icon-pacman"><small>广场</small></span></router-link>
    </ul>
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        expand: 'expand'
    })
}
</script>

<style>
.router-link-active span:before {
    color: #353535;
}
</style>