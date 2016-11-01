(function () {
    angular
        .module('app')
        .directive('resize', resize)

    function resize(_, $window) {
        return {
            restrict: 'EA',
            scope: true,
            link: (scope, elem, attrs) => {
                scope.width = $window.innerWidth

                angular.element($window).bind('resize', () => {
                    scope.width = $window.innerWidth
                    scope.$digest()
                })
            }
        }
    }
})()