(function() {
    angular
        .module('app')
        .factory('Post', ($cacheFactory, $resource) => {
            return $resource('/api/post/:id', {id: '@_id'}, {
                update: {method: 'PUT'},
                get: {method: 'GET', params: {type: '@type'}}
            });
        })
}());
