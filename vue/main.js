import Vue from 'vue'
import 'babel-polyfill'
import 'timeago.js'
import 'github-markdown-css'
import infiniteScroll from 'vue-infinite-scroll'
import cookie from 'cookie'
import store from './store'
import '../public/css/bootstrap.vue.min.css'
import '../public/css/icomoon.css'  // TODO @import in css caused the problem of relative path resolved error.
import './app.css'
import App from './App.vue'
import router from './router'


Vue.config.debug = true

Vue.use(infiniteScroll)

Vue.http.interceptors.push((request, next) => {
  if (cookie.parse(document.cookie)['XSRF-TOKEN']) {
    request.headers.set('X-XSRF-TOKEN', cookie.parse(document.cookie)['XSRF-TOKEN'])
  }
  next(response => {
    if (response.status !== 200) {
      if (response.data !== null && response.data.message) {
        store.commit('ERROR', {
          message: response.data.message,
        })
      } else {
                // 通常为 500 错误
        store.commit('ERROR', {
          message: '服务器开小差了',
        })
      }
    }
    if (response.status === 401) {
      if (!['/auth/login', '/auth/register'].includes(response.url)) {
        store.commit('OFFLINE')
      }
    }
  })
})

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
