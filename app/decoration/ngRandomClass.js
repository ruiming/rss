(function () {
    angular
        .module('app')
        .directive('ngRandomClass', ngRandomClass)

    function ngRandomClass() {
        return {
            restrict: 'EA',
            replace: false,
            scope: {
                ngClasses: '=ngRandomClass'
            },
            link: function (scope, elem) {
                elem.addClass(scope.ngClasses[Math.floor(Math.random() * (scope.ngClasses.length))])
            }
        }
    }
}())