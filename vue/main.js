import Vue from 'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import responseTransformer from './interceptors/response.js';
import _ from 'underscore';
import 'jquery';
import 'normalize.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'github-markdown-css';
import './app.scss';

Vue.config.debug = true;

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.http.interceptors.push(function(request, next) {
    // TODO 使用第三方插件替代
    request.headers.set('X-XSRF-TOKEN', document.cookie.split('=')[1]);
    next(responseTransformer);    
})

import login from './pages/login.vue';
import register from './pages/register.vue';
import home from './pages/home.vue';
import feeds from './pages/feeds.vue';
import mark from './pages/mark.vue';
import post from './pages/post.vue';
import feed from './pages/feed.vue';

const router = new VueRouter({
    //mode: 'history',
    //base: __dirname,
    routes: [{
        name: 'login',
        path: '/login',
        component: login
    }, {
        name: 'register',
        path: '/register',
        component: register
    }, {
        name: 'home',
        path: '/',
        component: home
    }, {
        name: 'feeds',
        path: '/feeds',
        component: feeds
    }, {
        name: 'mark',
        path: '/mark',
        component: mark
    }, {
        name: 'post',
        path: '/post/:id',
        component: post
    }, {
        name: 'feed',
        path: '/feed/:id',
        component: feed
    }]
})

const app = new Vue({
    router: router,
    render: h => h(App)
}).$mount('#app');
