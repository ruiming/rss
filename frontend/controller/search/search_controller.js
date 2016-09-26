(function() {
    angular
        .module('app')
        .controller('SearchController', SearchController);

    function SearchController($stateParams, $base64, $state, Feed) {
        var vm = this;
        let feedlink = decodeURIComponent(escape($base64.decode($stateParams.feedlink)));
        Feed.search({feedlink: feedlink}).$promise.then(res => {
            $state.go('feed', {id: res.data});
        }, err => {
            // TODO
            vm.err = err;
        });
    }
}());
