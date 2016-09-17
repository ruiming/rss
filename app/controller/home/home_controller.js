(function() {
    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController() {
        var vm = this;
        vm.test = 'It works!'
    }
}());