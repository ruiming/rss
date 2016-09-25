(function() {
    angular
        .module('app')
        .controller('SearchController', SearchController);

    function SearchController($stateParams, $base64) {
        var vm = this;
        vm.feedlink = decodeURIComponent(escape($base64.decode($stateParams.feedlink)));
    }
    
}());
