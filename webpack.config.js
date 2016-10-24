var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: './vue/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue'
        }, {
            test: /\.js$/,
            loader: 'babel',
            exclude: /node_modules/
        }, {
            test: /\.css$/,
            loader: "style!css"
        }, {
            test: /\.scss$/,
            loader: ["style", "css", "sass"]
        }, {
            test: /\.(eot|woff|woff2|ttf)([\?]?.*)$/,
            loader: "file"
        }, {
            test: /\.(png|jpg|gif|svg)$/,
            loader: 'file',
            query: {
            name: '[name].[ext]?[hash]'
            }
        }]
    },
    resolve: {
        alias: {vue: 'vue/dist/vue.js'}
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            root: "window",
            _: "underscore"
        })
    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        proxy: {
            '/api/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/auth/*': {
                target: 'http://127.0.0.1:3000'
            },
            '/img/*': {
                target: 'http://127.0.0.1:3000'
            }
        },
        port: 8080        
    },
    devtool: '#eval-source-map'
}
