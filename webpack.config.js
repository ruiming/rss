var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProduction = function () {
    return process.env.NODE_ENV === 'production'
}
var plugins = [
        // TODO
        new webpack.LoaderOptionsPlugin({
            options: {
                context: './public/css',
                postcss: [
                    require('postcss-import')({
                        addDependencyTo: webpack
                    }),
                    require('postcss-nested')({
                    }),
                    require('postcss-cssnext')({
                    })
                ]
            }}),
        new ExtractTextPlugin({
            filename:  'style.css',
            allChunks: true,
        })
    ],
    externals = {},
    output
if (isProduction()) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            test:     /(\.vue|\.js)$/,
            compress: {
                warnings: false
            },
        })
    )
    output = {
        path:       path.resolve(__dirname, './public/static/'),
        publicPath: '/static/',
        filename:   'build.js'
    }
    externals = {
        'vue':          'Vue',
        'underscore':   '_',
        'vue-resource': 'VueResource',
        'vue-router':   'VueRouter',
        'vuex':         'Vuex'
    }
} else {
    output = {
        path:       path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename:   'build.js'
    }
}
module.exports = {
    target: 'web',
    entry:  './vue/main.js',
    output,
    module: {
        rules: [{
            test:    /\.vue$/,
            loader:  'vue-loader',
            options: {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        loader:         ['css-loader?minimize', 'postcss-loader'],
                        fallbackLoader: 'vue-style-loader'
                    })
                }
            }
        }, {
            test:    /\.js$/,
            loader:  'babel-loader',
            exclude: /node_modules/
        }, {
            test:   /\.css$/,
            loader: ExtractTextPlugin.extract({
                loader: ['css-loader?minimize', 'postcss-loader']
            })
        }, {
            test:   /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
            loader: 'file-loader'
        }, {
            test:   /\.(png|jpg|gif|svg|ico)$/,
            loader: 'url-loader?limit=8192',
        }]
    },
    plugins,
    resolve: {
        modules: [path.join(__dirname, 'node_modules'), 'node_modules']
    },
    externals,
    devServer: {
        hot:                true,
        historyApiFallback: true,
        port:               7000,
        proxy:              {
            '/api/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/auth/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/img/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/css/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/vue/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/fonts/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/js/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/favicon/*': {
                target: 'http://127.0.0.1:3000'
            }
        },
    },
    devtool: isProduction() ? false : '#eval-source-map'
}
