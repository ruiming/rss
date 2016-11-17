<template>
<div class="msgbox">
<transition name="err">
    <p class="bg-danger msg" v-if="error">{{error}}</p>
</transition>
<transition name="info">
    <p class="bg-success msg" v-if="info">{{info}}</p>
</transition>
</div>
</template>

<script>
import store from '../store'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        error: 'error',
        info: 'info'
    })
}
</script>

<style scoped>
.msgbox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
}
.msg {
    color: white;
    text-align: center;
    padding: 10px;
}
.err-enter,
.err-leave-active {
    margin-top: -40px;
    transition: 0.3s linear all;
}
.err-leave,
.err-enter-active {
    transition: 0.3s linear all;
}
.info-enter,
.info-leave-active {
    opacity: 0;
    transition: 0.3s linear all;
}
.info-leave,
.info-enter-active {
    transition: 0.3s linear all;
}
.bg-danger {
    background-color: #f44336 !important;
}
.bg-success {
    background-color: #2196f3 !important;
}
</style>