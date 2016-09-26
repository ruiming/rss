(function() {
    angular
        .module('app')
        .controller('SearchController', SearchController);

    function SearchController(feed, $base64) {
        var vm = this;
        vm.feed = feed.data;
        console.log(vm.feed);
    }
}());
