var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var fs = require('fs')

var isProduction = function () {
    return process.env.NODE_ENV === 'production'
}
var plugins = [
        // 添加 postcss 插件
        // postcss.config.js 在 webpack 新版本无效
        new webpack.LoaderOptionsPlugin({
            options: {
                context: './public/css',
                postcss: [
                    require('postcss-nested'),
                    require('postcss-cssnext')
                ]
            }
        }),
        new webpack.LoaderOptionsPlugin({
            vue: {
                // use custom postcss plugins
                postcss: [
                    require('postcss-nested')(),
                    require('postcss-cssnext')()
                ]
            }
        })
    ],
    externals = {},
    output
if (isProduction()) {
    plugins.push(
        // 生产环境压缩 JavaScript 代码
        new webpack.optimize.UglifyJsPlugin({
            test:     /(\.vue|\.js)$/,
            compress: {
                warnings: false
            },
        }),
        // CSS 处理
        new ExtractTextPlugin({
            filename:  'style.[contenthash:4].css',
            allChunks: true,
        }),
        // 生产环境进行哈希值替换处理
        function () {
            this.plugin('done', function (statsData) {
                var stats = statsData.toJson()
                if (!stats.errors.length) {
                    var html = fs.readFileSync('./public/index.html', 'utf8')
                    var htmlOutput = html.replace(
                        /static\/(.+?)">/g,
                        function (word) {
                            let filename = word.split('/')[1].split('.')[0]
                            for (let i = 0; i < stats.assetsByChunkName.main.length; i++) {
                                if (stats.assetsByChunkName.main[i].indexOf(filename) !== -1) {
                                    return 'static/' + stats.assetsByChunkName.main[i] + '">'
                                }
                            }
                        })
                    fs.writeFileSync(
                        './public/index.html',
                        htmlOutput)
                }
            })
        }
    )
    // 生产环境输出目录
    output = {
        path:       path.resolve(__dirname, './public/static/'),
        publicPath: '/static/',
        filename:   'build.[chunkhash:4].js'
    }
    // 生产环境使用 CDN
    externals = {
        'vue':          'Vue',
        'underscore':   '_',
        'vue-resource': 'VueResource',
        'vue-router':   'VueRouter',
        'vuex':         'Vuex'
    }
} else {
    // 开发环境输出目录
    output = {
        path:       path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename:   'build.js'
    }
}
// 导出
module.exports = {
    target: 'web',
    entry:  './vue/main.js',
    output,
    module: {
        rules: [{
            test:    /\.vue$/,
            loader:  'vue-loader',
            options: isProduction() ? {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        loader:         ['css-loader?minimize', 'postcss-loader'],
                        fallbackLoader: 'vue-style-loader'
                    })
                }
            } : {}
        }, {
            test:    /\.js$/,
            loader:  'babel-loader',
            exclude: /node_modules/
        }, {
            test:   /\.css$/,
            loader: isProduction() ? ExtractTextPlugin.extract({
                loader: ['css-loader?minimize', 'postcss-loader']
            }) : ['style-loader', 'css-loader', 'postcss-loader']
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
