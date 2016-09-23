(function() {
    angular
        .module('app')
        .controller('FeedController', FeedController);

    function FeedController(feed, posts, _, storage, $scope, Post, $state) {
        var vm = this;
        vm.read = read;

        vm.feed = feed.data;
        vm.posts = posts.data.posts;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');
        console.log(vm.detail);

        for(let post of vm.posts) {
            if(vm.detail[post._id] && vm.detail[post._id][0].read) {
                post.read = true;
            }
        }

        // 传递给子路由作已读/未读判断
        $state.current.data = vm.posts;
        
        storage.feed_id = feed.data.feed_id;

        function read(post) {
            if(post.read) {
                return;
            } else {
                post.read = true;
                Post.update({feed_id: post.feed_id[0], id: post._id}, {type: 'read'});
            }
        }

        // listen the event from statusbar
        $scope.$on('readall',() => {
            for(let post of vm.posts) {
                post.read = true;
            }
        })
    }
    
}());
