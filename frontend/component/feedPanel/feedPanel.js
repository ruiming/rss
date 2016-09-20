(function() {
    angular
        .module('app')
        .directive('feedPanel', feedPanel);
    
    function feedPanel() {
        return {
            restrict: 'EA',
            scope: {
                feed: '='
            },
            replace: true,
            templateUrl: 'feedPanel/feedPanel.html',
            controller: function navbarController($scope) {

            }
        }
    }

}());