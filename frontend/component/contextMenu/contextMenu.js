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
                    console.log(res);
                    for(let i=0, len = res.data.length; i < len; i++) {
                        res.data[i] = Object.assign({}, res.data[i].feed_id[0], res.data[i], {feed_id: res.data[i].feed_id[0]._id})
                    }
                    $scope.feeds = res.data;
                });
            }
        }
    }

}());