(function() {
    angular
        .module('app')
        .directive('statusBar', statusBar);
    
    function statusBar() {
        return {
            restrict: 'EA',
            scope: true,
            replace: true,
            templateUrl: 'statusBar/statusBar.html',
            controller: function statusBarController($scope, $interval) {
                $scope.time = Date.now();
                $interval(() => {
                    $scope.time = Date.now();
                }, 1000);
            }
        }
    }

}());