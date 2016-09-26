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
            controllerAs: 'vm',
            controller: function navbarController($scope, Feed) {
                let vm = this;
                vm.feedit = feedit;

                function feedit() {
                    $scope.feed.feeded = !$scope.feed.feeded;
                    if($scope.feed.feeded) {
                        Feed.save({feedlink: $scope.feed.absurl});
                    } else {
                        Feed.delete({id: $scope.feed._id});
                    }
                }
            }
        }
    }

}());