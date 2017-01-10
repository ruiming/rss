(function () {
  angular
        .module('app')
        .controller('HomeController', HomeController)

  function HomeController(Feeds, feeds, posts, Post, $state) {
    const vm = this
    vm.currentPage = 0
    vm.posts = posts.data
    vm.feeds = feeds.data

    vm.goto = goto

    function goto(post) {
      Post.update({
        feed_id: post.feed_id,
        id:      post._id,
      }, {
        type: 'read',
      })
      $state.go('feed.post', {
        id:      post.feed_id,
        post_id: post._id,
      })
    }
  }
}())
