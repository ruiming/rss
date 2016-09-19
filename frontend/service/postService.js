(function() {
    angular
        .module('app')
        .factory('Post', $resource => {
            return $resource('/api/feed/:feed_id/post/:id', {id: '@_id'})
        })
}());
