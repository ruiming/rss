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
                Feed.get(res => {
                    $scope.feeds = res.data;
                });
                $scope.setTitle = function() {
                    storage.title = '';
                }
            }
        }
    }

}());