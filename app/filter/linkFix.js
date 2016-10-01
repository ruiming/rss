(function() {
    angular
        .module('app')
        .filter('linkFix', function() {
            return function(input, origin) {
                let re = /src="(\/[^\/].+?)"/g;
                let result = input.replace(re, (match, p, offset, string) => {
                    return `src="${origin}${p.slice(1)}"`;
                });
                return result;
            }
        });
}());
