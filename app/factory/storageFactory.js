/**
 * 单体通信
 */
(function () {
    angular
        .module('app')
        .factory('storage', storage);

    function storage() {
        return {};
    }
}());