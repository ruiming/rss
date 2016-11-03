import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import feed from './modules/feed'
import feeds from './modules/feeds'
import post from './modules/post'
import posts from './modules/posts'
import user from './modules/user'
import global from './modules/global'
import createLogger from 'vuex/dist/logger'
import * as types from './mutation-types'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
const msg = store => {
    store.subscribe(mutation => {
        // 默认3秒后清除错误信息, 1.5秒后清除提示信息
        if (mutation.type === 'ERROR') {
            store.commit(types.SET_ERROR_TIMEOUT,
                setTimeout(() => {
                    store.commit(types.SET_ERROR_TIMEOUT, null)
                }, mutation.payload.timeout || 3000)
            )
        } else if (mutation.type === 'INFO') {
            store.commit(types.SET_INFO_TIMEOUT,
                setTimeout(() => {
                    store.commit(types.SET_INFO_TIMEOUT, null)
                }, mutation.payload.timeout || 1500)
            )
        }
    })
}

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        feed,
        feeds,
        post,
        posts,
        user,
        global
    },
    strict:  debug,
    plugins: debug ? [createLogger(), msg] : [msg]
})
