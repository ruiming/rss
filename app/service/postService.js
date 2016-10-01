(function() {
    angular
        .module('app')
        .factory('Post', ($cacheFactory, $resource) => {
            return $resource('/api/feed/:feed_id/post/:id', {feed_id: '@feed_id',id: '@_id'}, {
                update: {method: 'PUT'},
                get: {method: 'GET', params: {type: '@type'}}
            });
        })
}());
