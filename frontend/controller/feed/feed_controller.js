(function() {
    angular
        .module('app')
        .controller('FeedController', FeedController);

    function FeedController(feed, posts, _, storage, $scope, Post, $state) {
        var vm = this;
        vm.read = read;
        vm.readall = readall;

        vm.feed = feed.data;
        vm.posts = posts.data.posts;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');

        $state.current.data = feed.data.link;
        
        for(let post of vm.posts) {
            if(vm.detail[post._id] && vm.detail[post._id][0].read) {
                post.read = true;
            }
        }
        
        function read(post) {
            if(post.read) {
                return;
            } else {
                post.read = true;
                Post.update({feed_id: post.feed_id[0], id: post._id}, {type: 'read'});
            }
        }

        function readall() {
            for(let post of vm.posts) {
                post.read = true;
            }
            Post.update({feed_id: vm.feed.feed_id, id: 0}, {type: 'read'});
        }
    }
}());
