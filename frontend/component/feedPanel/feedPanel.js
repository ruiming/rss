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
                        Feed.save({feedlink: $scope.feed.absurl}, res => {
                            $scope.feed.feeded = true;
                        }, err => {
                            // TODO
                            console.log(err);
                        });
                    } else {
                        Feed.delete({id: $scope.feed._id}, res => {
                            $scope.feed.feeded = false;
                        }, err => {
                            // TODO
                            console.log(err);
                        });
                    }
                }
            }
        }
    }

}());