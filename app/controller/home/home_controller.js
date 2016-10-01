(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController(posts, Post, $state, $timeout) {
        var vm = this;
        vm.posts = posts.data;
        vm.goto = goto;
        console.log(vm.posts);
        function goto(post) {
            Post.update({feed_id: post.feed_id, id: post._id}, {type: 'read'});
            $state.go('feed.post', {id: post.feed_id, post_id: post._id});
        }
    }
    
}());
