;(function(){

'use strict';

angular.module('app').run(['$templateCache', function($templateCache) {

  $templateCache.put('home/home_tpl.html', '<p class="text-primary">{{vm.test}}</p>');

}]);

})();