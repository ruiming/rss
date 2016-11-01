(function () {
    var help = {
        // 检测 URL 是否合法
        checkUrl: function (url) {
            if (!url) return false
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return url.match(re) !== null
        },
        // 检测邮箱是否合法
        validateEmail: function(email) {
            let re = /\S+@\S+\.\S+/
            return re.test(email)
        },
        // 检验密码是否合法
        validatePassword: function(password) {
            let re = /\w{6,18}/
            return re.test(password)
        }
    }

    // In angular, the module name is app.tools, and the factory name is tools.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = help
    } else {
        angular.module('app.tools', []).factory('tools', function () {
            return help
        })
    }
}())