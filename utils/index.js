(function () {
  const help = {
    // 检测 URL 是否合法
    checkUrl(url) {
      const re = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/
      return re.test(url)
    },
    // 检测邮箱是否合法
    validateEmail(email) {
      const re = /\S+@\S+\.\S+/
      return re.test(email)
    },
    // 检验密码是否合法
    validatePassword(password) {
      const re = /\w{6,18}/
      return re.test(password)
    },
  }

  // In angular, the module name is app.tools, and the factory name is tools.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = help
  } else {
    angular.module('app.tools', []).factory('tools', () => help)
  }
}())
