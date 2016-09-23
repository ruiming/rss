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
            controller: function contextMenuController($scope, Feed) {
                Feed.get(res => {
                    $scope.feeds = res.data;
                });
            }
        }
    }

}());