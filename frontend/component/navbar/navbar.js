(function() {
    angular
        .module('app')
        .directive('navbar', navbar);
    
    function navbar() {
        return {
            restrict: 'EA',
            scope: {
                title: '='
            },
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controllerAs: 'vm',            
            controller: function navbarController($timeout) {
                let vm = this;
                vm.blur = blur;

                function blur() {
                    $timeout(() => {
                        vm.active = false;                        
                    }, 800);
                }
            }
        }
    }

}());