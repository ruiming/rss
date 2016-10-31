import * as types from '../mutation-types';
import { Post } from '../../resource';

const state = {
    data: {}
}

const actions = {
    [types.READ](state, {id, type}) {
        if(state.data.status === null || state.data.read === false) {
            return Post.update({
                id: id,
                type: type
            });
        } else {
            return Promise.resolve();
        }
    }
}

export default {
    state,
    actions
}