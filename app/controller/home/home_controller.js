(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController(Feeds, feeds, posts, Post, $state, $timeout) {
        var vm = this;
        vm.currentPage = 0;
        vm.posts = posts.data;
        vm.feeds = feeds.data;

        vm.goto = goto;

        function goto(post) {
            Post.update({feed_id: post.feed_id, id: post._id}, {type: 'read'});
            $state.go('feed.post', {id: post.feed_id, post_id: post._id});
        }
        function next() {
            vm.feeds = Feeds.popular({page: ++vm.currentPage}).$promise.data;
        }
    }
    
}());
