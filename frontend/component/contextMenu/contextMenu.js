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
            controller: function contextMenuController($scope, Feed, storage) {
                let vm = this;
                vm.time = Date.now();
                vm.feeds = {};

                // Function
                vm.setTitle = setTitle;

                Feed.get(res => {
                    vm.feeds = res.data;
                });

                setInterval(() => {
                    vm.time = Date.now();
                    $scope.$digest();
                }, 1000);
                
                $scope.$on('ADD_FEED', (src, data) => {
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