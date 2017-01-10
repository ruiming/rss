(function () {
  angular
        .module('app')
        .filter('linkFix', () => function (input, origin) {
          // eslint-disable-next-line
          const re = /src="(\/[^\/].+?)"/g
          const result = input.replace(re, (match, p) => `src="${origin}${p.slice(1)}"`)
          return result
        })
}())
