(function() {
    angular
        .module('app')
        .directive('contextMenu', contextMenu);
    
    function contextMenu() {
        return {
            restrict: 'EA',
            scope: true,
            replace: true,
            templateUrl: 'contextMenu/contextMenu.html',
            controller: function contextMenuController($scope, Feed, storage) {
                $scope.time = Date.now();
                Feed.get(res => {
                    $scope.feeds = res.data;
                });
                $scope.setTitle = function() {
                    storage.title = '';
                    storage.status = '';
                    storage.begintime = '';
                }
                setInterval(() => {
                    $scope.time = Date.now();
                    $scope.$digest();
                }, 1000);
            }
        }
    }

}());