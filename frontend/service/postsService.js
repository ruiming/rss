(function() {
    angular
        .module('app')
        .factory('Posts', $resource => {
            return $resource('/api/posts', null, {
                get: {method: 'GET', params: {type: '@type'}}
            });
        })
}());
