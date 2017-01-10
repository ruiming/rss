require('babel-core/register')({
  presets: ['stage-3', 'es2015'],
})

require('babel-polyfill')

require('./fetch_favicons.js')

// 更新订阅源 favicon
// Patch
