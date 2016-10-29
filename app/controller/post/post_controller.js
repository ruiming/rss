(function () {
    angular
        .module('app')
        .controller('PostController', PostController);

    function PostController($state, post, Post, storage, $scope, _, $rootScope, $timeout, $cacheFactory) {
        var vm = this;
        vm.post = post;
        vm.currentPost = post.data.result;
        vm.currentPostDetail = post.data.detail || {
            mark: false,
            love: false
        };
        vm.begintime = Date.now();
        vm.currenttime = Date.now();
        vm.status = '';

        // Functon
        vm.love = love;
        vm.mark = mark;
        vm.home = home;

        // Date auto change
        setInterval(() => {
            vm.currenttime = Date.now();
            $scope.$digest();
        }, 1000);

        // Check if the post has been read yet
        if (vm.currentPostDetail !== null && vm.currentPostDetail.finish) {
            vm.status = '已经读过啦~\(≧▽≦)/~';
        }

        function love() {
            vm.currentPostDetail.love = !vm.currentPostDetail.love;
            Post.update({
                id: vm.currentPost._id
            }, {
                type: 'love',
                revert: true
            });
        }

        function mark() {
            vm.currentPostDetail.mark = !vm.currentPostDetail.mark;
            Post.update({
                id: vm.currentPost._id
            }, {
                type: 'mark',
                revert: true
            });
        }

        function home() {
            $state.go('feed', {
                id: vm.currentPost.feed_id[0]
            });
        }
    }
}());