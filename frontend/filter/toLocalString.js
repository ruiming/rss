(function() {
    angular
        .module('app')
        .filter('toLocalString', function($filter) {
            return function(input) {
                return $filter('date')(Date.parse(input), 'yyyy-MM-dd HH:mm');
            }
        });
}());
