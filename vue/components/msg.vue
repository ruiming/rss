<template>
<transition name="msg">
<div v-if="msgs.length">
    <div v-for="msg in msgs">
        <p class="bg-danger msg">{{msg}}</p>
    </div>
</div>
</transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        msgs: 'error'
    })
}
</script>

<style lang="sass">
.msg {
    margin: 10px 0;
    padding: 15px;
    transition: 0.3s linear all;
}
.msg-enter,
.msg-leave-active {
    opacity: 0;
    transition: 0.3s linear all;
}
.msg-leave,
.msg-enter-active {
    transition: 0.3s linear all;
}
</style>