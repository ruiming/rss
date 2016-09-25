
(function() {
    angular
        .module('app')
        .factory('Post', ($cacheFactory, $resource) => {
            return $resource('/api/feed/:feed_id/post/:id', {id: '@_id'}, {
                update: {method: 'PUT'},
                get: {method: 'GET'}
            });
        })
}());

