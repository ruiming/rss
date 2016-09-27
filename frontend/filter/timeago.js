(function() {
    angular
        .module('app')
        .filter('timeago', function() {
            return function(input) {
                // TODO: 会被执行两次，并且如果input被watch时会多次执行
                let now = Date.now();
                let ago = (now - Date.parse(input)) / 1000;
                let output = null;
                // TODO: if I want to make it change in real time.
                if (ago < 10 * 60) {
                    output = `刚刚`;
                } else if (ago < 60 * 60) {
                    output = `${Math.round(ago / 60)} 分钟前`;
                } else if (ago < 60 * 60 * 24) {
                    output = `${Math.round(ago / 60 / 60)} 小时前`;
                } else if (ago < 60 * 60 * 24 * 30) {
                    output = `${Math.round(ago / 60 / 60 / 24)} 天前`;
                } else if (ago < 60 * 60 * 24 * 365) {
                    output = `${Math.round(ago / 60 / 60 / 24 / 30)} 个月前`;
                } else if (ago < 60 * 60 * 24 * 365 * 3 ) {
                    output = `${Math.round(ago / 60 / 60 / 24 / 365 )} 年前`;
                } else {
                    output = '很久很久以前';
                }
                return output;
            }
        });
}());
