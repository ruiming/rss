(function() {
    angular
        .module('app')
        .controller('FeedController', FeedController);

    function FeedController(feed, posts) {
        var vm = this;
        vm.feed = feed.data;
        vm.posts = posts.data;
        console.log(vm.feed);
    }
    
}());
