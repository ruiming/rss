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
            controller: function statusBarController($scope, $interval, storage, Post, $rootScope) {
                $scope.readall = readall;
                
                $scope.title = storage.title;
                $scope.time = Date.now();

                // TODO: would it effect the angular perfomance ?
                setInterval(() => {
                    $scope.title = storage.title;
                    $scope.time = Date.now();
                    $scope.feed_id = storage.feed_id;
                    $scope.status = storage.status;
                    $scope.begintime = storage.begintime;
                    
                    $scope.$digest();
                }, 1000);

                function readall() {
                    Post.update({feed_id: $scope.feed_id, id: 0}, {type: 'read'});
                    // is there a better way ?
                    $rootScope.$broadcast('readall');
                }
            }
        }
    }

}());