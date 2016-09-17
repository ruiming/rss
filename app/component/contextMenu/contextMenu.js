(function() {
    angular
        .module('app')
        .directive('contextMenu', contextMenu);
    
    function contextMenu() {
        return {
            restrict: 'EA',
            scope: true,
            templateUrl: 'contextMenu/contextMenu.html',
            controller: function contextMenuController($scope) {
                
            }
        }
    }

}());