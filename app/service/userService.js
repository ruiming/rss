(function () {
  angular
        .module('app')
        .factory('User', $resource => $resource('/api/user', {}, {
          update: {
            method: 'PUT',
          },
          logout: {
            method: 'POST',
            url:    '/auth/logout',
          },
        }))
}())
