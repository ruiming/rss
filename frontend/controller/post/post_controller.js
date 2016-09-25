(function() {
    angular
        .module('app')
        .controller('PostController', PostController);

    function PostController($state, post, Post, storage, $scope, _, $rootScope, $timeout, $cacheFactory) {
        var vm = this;
        vm.post = post;

        vm.currentPost = post.data.result;
        vm.currentPostDetail = post.data.detail;
        
        vm.begintime = Date.now();
        vm.currenttime = Date.now();
        vm.status = '';

        vm.love = love;
        vm.mark = mark;

        setInterval(() => {
            vm.currenttime = Date.now();
            $scope.$digest();
        }, 1000);

        // TODO: 黑人问号? I just want to get the title but avoid the break of inherit
        if(void 0 !== $state.router.globals.$current.parent.self.data) {
            vm.origin = $state.router.globals.$current.parent.self.data;
        } else {
            vm.origin = $state.router.globals.current.data;
        }

        if(vm.currentPostDetail !== null && vm.currentPostDetail.finish) {
            vm.status = '已经读过啦~\(≧▽≦)/~';
        }

        function love() {
            vm.currentPostDetail.love = !vm.currentPostDetail.love;
            Post.update({feed_id: vm.currentPost.feed_id[0], id: vm.currentPost._id}, {type: 'love', revert: true});
        }

        function mark() {
            vm.currentPostDetail.mark = !vm.currentPostDetail.mark;
            Post.update({feed_id: vm.currentPost.feed_id[0], id: vm.currentPost._id}, {type: 'mark', revert: true});
        }

    }
}());
