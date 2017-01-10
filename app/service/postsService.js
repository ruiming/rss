(function () {
  angular
        .module('app')
        .factory('Posts', $resource => $resource('/api/posts', null, {
          get: {
            method: 'GET',
            params: {
              type:    '@type',
              feed_id: '@feed_id',
            },
          },
          recent: {
            method: 'GET',
            url:    '/api/posts/recent',
          },
          update: {
            method: 'PUT',
          },
        }))
}())
