(function() {
    angular
        .module('app')
        .controller('PostController', PostController);

    function PostController(posts, storage) {
        var vm = this;
        vm.currentPost = posts.data;
        storage.title = vm.currentPost.title;
    }
    
}());
