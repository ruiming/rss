(function () {
  angular
        .module('app')
        .factory('Feed', $resource => $resource('/api/feed/:id', null, {
          update: {
            method: 'PUT',
          },
        }))
}())
