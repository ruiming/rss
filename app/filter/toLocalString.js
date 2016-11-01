(function () {
    angular
        .module('app')
        .filter('toLocalString', function ($filter) {
            return function (input, format) {
                return $filter('date')(Date.parse(input), format)
            }
        })
}())