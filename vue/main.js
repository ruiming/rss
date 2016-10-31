import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import router from './router.js';
import responseTransformer from './interceptors/response.js';
import cookie from 'cookie';
import _ from 'underscore';
import store from './store';
import 'timeago.js';
import 'normalize.css';
import '../public/css/bootstrap.vue.min.css';
import '../public/css/icomoon.css';
import 'github-markdown-css';
import './app.scss';

Vue.config.debug = true;

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.interceptors.push(function (request, next) {
    if (cookie.parse(document.cookie)['XSRF-TOKEN']) {
        request.headers.set('X-XSRF-TOKEN', cookie.parse(document.cookie)['XSRF-TOKEN']);
    }
    next(responseTransformer);
})

const app = new Vue({
    router: router,
    store,
    render: h => h(App)
}).$mount('#app');