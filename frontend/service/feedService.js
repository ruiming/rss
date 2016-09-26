(function() {
    angular
        .module('app')
        .factory('Feed', $resource => {
            return $resource('/api/feed/:id', {id: '@_id'}, {
                search: {method: 'POST', params:{search: true}}
            });
        })
}());
