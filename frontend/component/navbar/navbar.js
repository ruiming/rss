(function() {
    angular
        .module('app')
        .directive('navbar', navbar);
    
    function navbar() {
        return {
            restrict: 'EA',
            scope: {
                title: '='
            },
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controller: function navbarController($scope) {
            }
        }
    }

}());