import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as getters from './getters';
import feed from '../modules/feed';
import createLogger from 'vuex/dist/logger';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.store({
    actions,
    getters,
    modules: {
        feed,
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})