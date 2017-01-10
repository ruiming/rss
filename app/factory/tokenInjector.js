(function () {
  angular
        .module('app')
        .factory('tokenInjector', tokenInjector)

  function tokenInjector($injector, $q) {
    const count = {}

    return {

            // 正常情况下，XSRF 不正确会触发该错误
            // 从而触发跳转到登录页面
            // TODO 全局提示弹框
      responseError(rejection) {
        if (rejection.status === 401) {
          console.log(rejection.data.message)
          setTimeout(() => document.location.replace('/'), 1000)
          return $q.reject(rejection)
        } else if ((rejection.status === 404 || rejection.status === -1) && (rejection.data === null || rejection.data.success !== undefined) && count[rejection.config.url] === undefined) {
          count[rejection.config.url] = true
          const $http = $injector.get('$http')
          return $http(rejection.config)
        }
        return $q.reject(rejection)
      },
    }
  }
}())
