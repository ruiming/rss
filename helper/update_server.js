require("babel-core/register")({
    presets: ['stage-3', 'es2015']
})

require("babel-polyfill")

require("./update.js")