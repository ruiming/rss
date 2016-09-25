(function() {
    var help = {
        checkUrl: function(url) {
            if(!url) return false;
            let re = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
            return url.match(re) !== null;
        }
    }

    // In angular, the module name is app.tools, and the factory name is tools.
    if(typeof module !== 'undefined' && module.exports) {
        module.exports = help;
    } else {
        angular.module('app.tools', []).factory('tools', function() {
            return help;
        });
    }
}());