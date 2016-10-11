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
            controllerAs: 'vm',
            controller: function contextMenuController($scope, Feed, _, User, $window) {
                let vm = this;
                vm.time = Date.now();
                vm.expand  = false;
                vm.feeds = [];
                
                Feed.get(res => vm.feeds = _.groupBy(res.data, 'folder'));
                User.get(res => vm.user = res.data);

                setInterval(() => {
                    vm.time = Date.now();
                    $scope.$digest();
                }, 1000);
                         
                $scope.$on('EXPAND', (event, data) => vm.expand = !vm.expand);
                $scope.$on('ADD_FEED', (event, data) => {
                    if(vm.feeds.default) {
                        vm.feeds.default.push(data);
                    } else {
                        vm.feeds['default'] = [data];
                    }
                });
                $scope.$on('DELETE_FEED', (event, data) => {
                    vm.feeds = _.mapObject(vm.feeds, feeds => feeds = _.filter(feeds, feed => feed.feed_id !== data.feed_id));
                });
                $scope.$on('READ_POST', (event, data) => {
                    vm.feeds = _.mapObject(vm.feeds, feeds => _.each(feeds, feed => feed.feed_id === data ? feed.unread -- : ''));
                });
            }
        }
    }
}());
