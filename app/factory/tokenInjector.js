(function() {
    angular
        .module('app')
        .factory('tokenInjector', tokenInjector);

    function tokenInjector($injector, $q, $cookies, $cacheFactory, $timeout) {
        
        return {
            // Warning: The cookie should set to httponly to keep safe.

            response: function(config) {
                let data = config.data.data;
                if(Array.isArray(data)) {
                    for(let i = 0, len = data.length; i < len; i++) {
                        if(void 0 !== data[i].feed_id && Array.isArray(data[i].feed_id)) {
                            // 提取 feed_id 
                            if(typeof data[i].feed_id[0] === 'string') {
                                config.data.data[i].feed_id = data[i].feed_id[0];
                            } else {
                                config.data.data[i] = Object.assign(data[i].feed_id[0], data[i], {feed_id: data[i].feed_id[0]._id, feed_title: data[i].feed_id[0].title});                             
                            }
                        }
                        if(void 0 !== data[i].user_id && Array.isArray(data[i].user_id)) {
                            config.data.data[i].user_id = data[i].user_id[0];
                        }
                    }
                } else if (typeof data === 'object'){
                        if(void 0 !== data.feed_id && Array.isArray(data.feed_id)) {
                            if(typeof data.feed_id[0] === 'string') {
                                config.data.data.feed_id = data.feed_id[0];
                            } else {
                                config.data.data = Object.assign(data.feed_id[0], data, {feed_id: data.feed_id[0]._id, feed_title: data.feed_id[0].title});                                                            
                            }
                        }
                        if(void 0 !== data.user_id && Array.isArray(data.user_id)) {
                            config.data.data.user_id = data.user_id[0];
                        }
                }
                return $q.when(config);
            }
        }

    }

}());
