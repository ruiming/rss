(function() {
    angular
        .module('app')
        .directive('scrollListen', scrollListen);
    
    function scrollListen(_, Post) {
        return {
            restrict: 'EA',
            scope: true,
            link: function(scope, elem, attrs) {
                var func = _.throttle(function(e) {
                    let target = e.target;
                    if(target.scrollHeight - target.clientHeight === target.scrollTop) {
                        // Read over
                        Post.update({feed_id: scope.vm.currentPost.feed_id, id: scope.vm.currentPost._id}, {
                            type: 'read'
                        });
                    }
                }, 300);
                angular.element(elem).on('scroll', func);
            }
        }
    }

}());