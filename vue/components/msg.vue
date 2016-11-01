<template>
<transition name="msg">
<div>
    <div v-show="errors.length">
        <div v-for="error in errors">
            <p class="bg-danger msg">{{error}}</p>
        </div>
    </div>
    <div v-show="infos.length && !errors.length">
        <div v-for="info in infos">
            <p class="bg-success msg">{{info}}</p>
        </div>
    </div>
</div>
</transition>
</template>

<script>
import store from '../store'
import { mapGetters, mapActions } from 'vuex'
export default {
    computed: mapGetters({
        errors: 'error',
        infos: 'info'
    }),

    watch: {
        // ERROR 2.5秒有效
        'errors' (to, from) {
            if(to.length) {
                this.$store.commit('CLEAR_INFO')
                setTimeout(() => {
                    this.$store.commit('CLEAR_ERROR')
                }, 2500)
            }
        },
        // INFO 5秒有效
        'infos' (to, from) {
            if(to.length) {
                setTimeout(() => {
                    this.$store.commit('CLEAR_INFO')
                }, 5000)
            }
        }
    }
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