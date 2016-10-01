(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController(posts) {
        var vm = this;
        vm.posts = posts.data;
    }
    
}());
