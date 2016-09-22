(function() {
    angular
        .module('app')
        .factory('tokenInjector', tokenInjector);

    function tokenInjector($injector, $q, $cookies) {
        let jwt = undefined;
        
        return {
            // Warning: The cookie should set to httponly to keep safe.
            request: function(config) {
                var deferred = $q.defer();
                if(void 0 === jwt) {
                    jwt = $cookies.get('jwt');
                }
                config.headers['Authorization'] = "Bearer " + jwt;
                deferred.resolve(config);
                return deferred.promise;
            },

            response: function(config) {
                return config;
            }
        }
    }

}());
