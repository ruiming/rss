(function() {
    angular
        .module('app')
        .controller('FeedController', FeedController);

    function FeedController($rootScope, feed, posts, _, storage, $scope, Post, $state, Feed, $stateParams) {
        var vm = this;
        vm.feed = feed.data;
        vm.feed.feeded = angular.isDefined(feed.data.feed_time);        
        vm.feed.feed_id = $stateParams.id;        
        vm.posts = posts.data.posts;
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
                $rootScope.$broadcast('ADD_FEED', vm.feed);
                vm.feed.feedNum ++;
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
                $rootScope.$broadcast('READ_POST', post.feed_id[0]);
                Post.update({feed_id: post.feed_id[0], id: post._id}, {type: 'read'});
            }
        }
        function readall() {
            for(let post of vm.posts) {
                console.log(post.read);
                if(!post.read) $rootScope.$broadcast('READ_POST', vm.feed.feed_id);
                post.read = true;
            }
            Post.update({feed_id: vm.feed.feed_id, id: 0}, {type: 'read'});
        }
    }
}());
