import * as types from '../mutation-types'

const state = {
  post: {},
}

const mutations = {
    // 收藏/取消收藏成功
  [types.MARK](state, { _id }) {
    if (state.post._id === _id) {
      state.post.mark = !state.post.mark
    }
  },
    // 点赞/取消点赞成功
  [types.LOVE](state, { _id }) {
    if (state.post._id === _id) {
      state.post.love = !state.post.love
    }
  },
    // 已读
  [types.READ_POST](state, { id }) {
    if (state.post._id === id) {
      state.post.read = true
    }
  },
    // 获取文章信息
  [types.RECEIVE_POST](state, post) {
    state.post = post
  },
}

export default {
  state,
  mutations,
}
