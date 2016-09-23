(function() {
    angular
        .module('app')
        .controller('FeedController', FeedController);

    function FeedController(feed, posts, _, storage, $scope) {
        var vm = this;
        vm.feed = feed.data;
        vm.posts = posts.data.posts;
        vm.detail = _.groupBy(posts.data.detail, 'post_id');

        storage.feed_id = feed.data._id;
    }
    
}());
