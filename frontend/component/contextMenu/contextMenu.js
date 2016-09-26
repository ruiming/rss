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
            controller: function contextMenuController($scope, Feed, storage, _) {
                let vm = this;
                vm.time = Date.now();
                vm.feeds = {};

                // Function
                vm.setTitle = setTitle;

                Feed.get(res => {
                    vm.feeds = res.data;
                    console.log(vm.feeds);
                });

                setInterval(() => {
                    vm.time = Date.now();
                    $scope.$digest();
                }, 1000);
                
                $scope.$on('ADD_FEED', (event, data) => {
                    data.feed_id = data._id;
                    vm.feeds.push(data);
                })
                $scope.$on('DELETE_FEED', (event, data) => {
                    vm.feeds = _.filter(vm.feeds, feed => {
                        return feed.feed_id != data._id;
                    });
                })

                function setTitle() {
                    storage.title = '';
                    storage.status = '';
                    storage.begintime = '';
                }
            }
        }
    }

}());