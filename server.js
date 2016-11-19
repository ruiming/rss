require('babel-core/register')({
    presets: ['es2015']
})
// stage-3 is not needed in node v7

require('events').EventEmitter.prototype._maxListeners = 100

require('babel-polyfill')

require('./index.js')
