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
            controller: function statusBarController($scope, $interval, storage) {
                $scope.readall = readall;
                
                $scope.title = storage.title;
                $scope.time = Date.now();

                // TODO: would it effect the angular perfomance ?
                setInterval(() => {
                    $scope.title = storage.title;
                    $scope.time = Date.now();
                    $scope.feed_id = storage.feed_id;

                    $scope.$digest();
                }, 500);

                function readall() {
                    
                }
            }
        }
    }

}());