(function () {
  const underscore = angular.module('underscore', [])
  underscore.factory('_', ['$window', function ($window) {
    return $window._
  }])
}())
