(function () {
    angular
        .module('app')
        .factory('Feed', $resource => {
            return $resource('/api/feed/:id', null, {
                'update': {
                    method: 'PUT',
                }
            })
        })
}())
