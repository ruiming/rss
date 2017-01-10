(function () {
  angular
        .module('app')
        .filter('toLocalString', $filter => function (input, format) {
          return $filter('date')(Date.parse(input), format)
        })
}())
