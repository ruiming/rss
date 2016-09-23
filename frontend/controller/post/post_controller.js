(function() {
    angular
        .module('app')
        .controller('PostController', PostController);

    function PostController(posts, storage, $scope, $state, _) {
        var vm = this;
        vm.currentPost = posts.data;
        vm.posts = _.groupBy($state.current.data, '_id');

        storage.title = vm.currentPost.title;
        storage.begintime = Date.now();
        storage.status = '';
    }
    
}());
