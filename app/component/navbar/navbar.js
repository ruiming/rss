(function() {
    angular
        .module('app')
        .directive('navbar', navbar);
    
    function navbar($state, $base64) {
        return {
            restrict: 'EA',
            scope: {
                title: '='
            },
            replace: true,
            templateUrl: 'navbar/navbar.html',
            controllerAs: 'vm',            
            controller: function navbarController($scope, User, $location,  $rootScope, $timeout, tools) {
                let vm = this, timeout;

                // Function
                vm.blur = blur;
                vm.search = search;
                vm.focus = focus;
                vm.expand = expand;
                vm.logout = logout;

                function expand() {
                    $rootScope.$broadcast('EXPAND');
                }
                function focus() {
                    form.input.focus();
                    if(timeout) {
                        $timeout.cancel(timeout);
                    }
                    vm.active = true;
                }
                function blur() {
                    timeout = $timeout(() => {
                        vm.active = false;                        
                    }, 800);
                }
                function search(feedlink) {
                    if(!tools.checkUrl(feedlink)) {
                        return false;
                    } else {
                        $state.go('search', {feedlink: $base64.encode(unescape(encodeURIComponent(feedlink)))});
                    }
                }
                function logout() {
                    User.logout().$promise.then(data => {
                        $location.path('/').replace();
                    });
                }
            }
        }
    }

}());
