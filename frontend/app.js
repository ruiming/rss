(function() {
    angular
        .module('app', [
            'ui.router',
            'ui.bootstrap',
            'ngTouch',
            'ngAnimate'
        ])
        .config(config);

    function config($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home/home_tpl.html',
                controller: 'HomeController as vm'
            });
    }
}());
