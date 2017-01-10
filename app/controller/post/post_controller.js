(function () {
  angular
        .module('app')
        .controller('PostController', PostController)

  function PostController($state, post, Post, storage, $scope) {
    const vm = this
    vm.post = post.data

    vm.begintime = Date.now()
    vm.currenttime = Date.now()
    vm.status = ''

    // Functon
    vm.love = love
    vm.mark = mark
    vm.home = home

    // Date auto change
    setInterval(() => {
      vm.currenttime = Date.now()
      $scope.$digest()
    }, 1000)

    // Check if the post has been read yet
    if (vm.post !== null && vm.post.finish) {
      vm.status = '已经读过啦~\\(≧▽≦)/~'
    }

    function love() {
      vm.post.love = !vm.post.love
      Post.update({
        id: vm.post._id,
      }, {
        type:   'love',
        revert: true,
      })
    }

    function mark() {
      vm.post.mark = !vm.post.mark
      Post.update({
        id: vm.post._id,
      }, {
        type:   'mark',
        revert: true,
      })
    }

    function home() {
      $state.go('feed', {
        id: vm.post.feed_id,
      })
    }
  }
}())
