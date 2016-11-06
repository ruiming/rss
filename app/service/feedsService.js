(function () {
    angular
        .module('app')
        .factory('Feeds', $resource => {
            return $resource('/api/feeds', {}, {
                popular: {
                    method: 'GET',
                    params: {
                        order:      'feedNum',
                        'per_page': 5
                    }
                }
            })
        })
}())
