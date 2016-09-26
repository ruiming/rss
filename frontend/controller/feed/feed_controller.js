(function() {
    angular
        .module('app')
        .controller('FeedController', FeedController);

    function FeedController(feed, posts, _, storage, $scope, Post, $state, Feed) {
        var vm = this;
        vm.feed = feed.data;
        vm.feed.feeded = angular.isDefined(feed.data.feed_time);        
        vm.posts = posts.data.posts;
        vm.feed_id = angular.isDefined(feed.data.feed_id) ? feed.data.feed_id : feed.data._id;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');

        // Function
        vm.read = read;
        vm.readall = readall;
        vm.feedit = feedit;

        // Will be used by its' child state
        $state.current.data = feed.data.link;
        
        // get the status of each post
        for(let post of vm.posts) {
            if(vm.detail[post._id] && vm.detail[post._id][0].read) {
                post.read = true;
            }
        }
         
        function feedit() {
            Feed.save({feedlink: vm.feed.absurl}, res => {
                vm.feed.feeded = true;
            }, err => {
                // TODO
                console.log(err);
            });
        }
        function read(post) {
            for(let post of vm.posts) {
                post.active = false;
            }
            post.active = true;
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
            Post.update({feed_id: vm.feed_id, id: 0}, {type: 'read'});
        }
    }
}());
