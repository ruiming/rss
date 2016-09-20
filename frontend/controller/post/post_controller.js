(function() {
    angular
        .module('app')
        .controller('PostController', PostController);

    function PostController(posts) {
        var vm = this;
        vm.currentPost = posts.data[0];
    }
    
}());
