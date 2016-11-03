import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import cookie from 'cookie'
import store from './store'
import 'timeago.js'
import 'normalize.css'
import '../public/css/bootstrap.vue.min.css'
import '../public/css/icomoon.css'
import 'github-markdown-css'
import './app.scss'

Vue.config.debug = true

Vue.http.interceptors.push(function (request, next) {
    if (cookie.parse(document.cookie)['XSRF-TOKEN']) {
        request.headers.set('X-XSRF-TOKEN', cookie.parse(document.cookie)['XSRF-TOKEN'])
    }
    next(response => {
        if (response.status !== 200) {
            if (response.data !== null && response.data.message) {
                store.commit('ERROR', {
                    message: response.data.message
                })
            } else {
                // 通常为 500 错误
                store.commit('ERROR', {
                    message: '服务器开小差了'
                })
            }
            // TODO 处理错误的页面跳转问题
        }
        if (response.status === 401) {
            if (!['/auth/login', '/auth/register'].includes(response.url)) {
                store.commit('OFFLINE')
            }
        }
    })
})

new Vue({
    router: router,
    store,
    render: h => h(App)
}).$mount('#app')
