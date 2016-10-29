import Vue from 'vue';
import VueRouter from 'vue-router';
import login from './pages/login.vue';
import register from './pages/register.vue';
import home from './pages/home.vue';
import feeds from './pages/feeds.vue';
import mark from './pages/mark.vue';
import post from './pages/post.vue';
import feed from './pages/feed.vue';
import square from './pages/square.vue';
import bus from './bus.js';

Vue.use(VueRouter);
const router = new VueRouter({
    mode: 'history',
    base: '/',
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
    }, {
        name: 'square',
        path: '/square',
        component: square
    }]
});
router.beforeEach((to, from, next) => {
    bus.$emit('EXPAND', false);
    if(typeof ga !== "undefined") {
        ga('send', 'pageview', to.fullPath);        
    }
    next();
});
export default router;