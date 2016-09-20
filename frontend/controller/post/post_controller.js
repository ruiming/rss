(function() {
    angular
        .module('app')
        .controller('PostController', PostController);

    function PostController(posts) {
        var vm = this;
        console.log(posts);
        vm.currentPost = posts.data;
    }
    
}());
