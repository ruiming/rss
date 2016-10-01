(function() {
    angular
        .module('app')
        .factory('User', $resource => {
            return $resource('/api/user');
        })
}());
