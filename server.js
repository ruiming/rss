require('babel-core/register')({
  presets: ['es2015'],
})

require('events').EventEmitter.prototype._maxListeners = 100

require('babel-polyfill')

require('./index.js')
