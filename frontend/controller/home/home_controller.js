(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController($timeout) {
        var vm = this;
        vm.title = 'It works!'
    }
    
}());
