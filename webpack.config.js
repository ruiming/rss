var path = require('path');
var webpack = require('webpack');
var isProduction = function() {
    return process.env.NODE_ENV === 'production';
}
var plugins = [], output;
if(isProduction()) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            test: /(\.vue|\.js)$/,
            compress: {
                warnings: false
            },
        })
    );
    output = {
        path: path.resolve(__dirname, './public/js/'),
        publicPath: '/js/',
        filename: 'build.js'
    }
} else {
    output = {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js'
    }
}
module.exports = {
    entry: './vue/main.js',
    output: output,
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
    plugins: plugins,
    externals: {
        "vue": 'Vue',
        "underscore": '_',
        'vue-resource': 'VueResource',
        'vue-router': 'VueRouter'
    },
    devServer: {
        hot: true,
        historyApiFallback: true,
        port: 7000,
        proxy: {
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
            }
        },
    },
    devtool: isProduction() ? null : '#eval-source-map'
}
