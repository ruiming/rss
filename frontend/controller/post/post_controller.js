(function() {
    angular
        .module('app')
        .controller('PostController', PostController);

    function PostController($state, post, storage, $scope, _) {
        var vm = this;

        vm.currentPost = post.data.result;
        vm.currentPostDetail = post.data.detail;

        storage.title = vm.currentPost.title;
        storage.begintime = Date.now();

        // 黑人问号? I just want to get the title but avoid the break of inherit
        if(void 0 !== ($state.router.globals.$current.parent.self.data)) {
            vm.origin = $state.router.globals.$current.parent.self.data;
        } else {
            vm.origin = $state.router.globals.current.data;
        }

        if(vm.currentPostDetail !== null && vm.currentPostDetail.finish) storage.status = '已经读过啦~\(≧▽≦)/~';
        else storage.status = '';
    }
    
}());
