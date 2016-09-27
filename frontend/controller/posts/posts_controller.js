(function() {
    angular
        .module('app')
        .controller('PostsController', PostsController);

    function PostsController($stateParams, posts, $state, Post) {
        var vm = this;
        vm.posts = posts.data;
        
        // Function
        vm.goto = goto;

        function goto(post) {
            for(let post of vm.posts) {
                post.active = false;
            }
            post.active = true;
            if(post.read) {
                return;
            } else {
                post.read = true;
                Post.update({feed_id: post.feed_id, id: post._id}, {type: 'read'});
            }
            $state.current.data = post.feed_id;
            $state.go('posts.post', {id: post._id});
        }
    }
}());
