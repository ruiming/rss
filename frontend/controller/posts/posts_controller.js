(function() {
    angular
        .module('app')
        .controller('PostsController', PostsController);

    function PostsController($stateParams, posts) {
        var vm = this;
        vm.posts = posts.data;
    }
}());
