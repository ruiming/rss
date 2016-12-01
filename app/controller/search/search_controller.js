(function () {
    angular
        .module('app')
        .controller('SearchController', SearchController)

    function SearchController($stateParams, $base64, $state, Feed) {
        var vm = this
        Feed.save({
            feedlink: decodeURIComponent(escape($base64.decode($stateParams.feedlink)))
        }).$promise.then(res => {
            console.log(res)
            $state.go('feed', {
                id: res.data
            })
        }, err => {
            vm.err = err.data.message
        })
    }
}())
