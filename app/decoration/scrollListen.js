(function () {
    angular
        .module('app')
        .directive('scrollListen', scrollListen)

    function scrollListen(_) {
        return {
            restrict: 'EA',
            scope: true,
            link: (scope, elem) => {
                var first = true
                var func = _.throttle(e => {
                    if (void 0 !== scope.vm.currentPostDetail && null !== scope.vm.currentPostDetail) {
                        let target = e.target
                        // 100px 偏差
                        if (first && target.scrollHeight - target.clientHeight - 100 < target.scrollTop) {
                            first = false
                            scope.vm.status = '到底啦~\(≧▽≦)/~'
                        }
                    }
                }, 200)
                angular.element(elem).on('scroll', func)
                // 如果没有滚动条的话，则立即标为读完
                setTimeout(() => {
                    if (void 0 !== scope.vm.currentPostDetail && null !== scope.vm.currentPostDetail) {
                        if (angular.element(elem[0].scrollHeight)[0] === angular.element(elem[0].offsetHeight)[0]) {
                            scope.vm.status = '到底啦~\(≧▽≦)/~'
                        }
                    }
                }, 0)
            }
        }
    }

}())