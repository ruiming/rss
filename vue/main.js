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
        if (response.status === 401) {
            if (!['/auth/login', '/auth/register', '/api/user'].includes(response.url)) {
                router.push({
                    name: 'login'
                })
            }
        }
    })
})

new Vue({
    router: router,
    store,
    render: h => h(App)
}).$mount('#app')
