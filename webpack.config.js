const path = require('path');
const webpack = require("webpack");

const BUILD_MODE = (process.env.BUILD_MODE || 'dev').trim();
const production = BUILD_MODE == 'prod';

module.exports = {
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    	root: [
    		path.resolve('./node_modules/')
    	]
    },
    entry: {
        index: './src/index.js',
        vendor: [
            // lib
            'knockout',
            'jquery',
            'script!jquery',
            'script!jquery.mousewheel',
            'script!jquery.transit',
            'imports?this=>window!bootstrap',
            'imports?this=>window!script!jsplumb/dist/js/jsPlumb-1.7.9.js',

            //polyfills
            'script!es6-shim',
            'script!angular2/bundles/angular2-polyfills.js',

            // angular2
            'reflect-metadata',
            'rxjs',
            'angular2/core',
            'angular2/common',
            'angular2/router',
            'angular2/http',
            'angular2/platform/browser',

            'clipboard',

            // svg
            'script!svg.js',
            'script!svg.filter.js',

            // css
            'jsplumb/dist/css/jsplumb.css',
            'bootstrap/dist/css/bootstrap.css',
            'bootswatch/superhero/bootstrap.css',
            'font-awesome/css/font-awesome.css'
        ]
    },
    output: {
        filename: "[name].js"
    },
    plugins: (function(){
        var plugins = [
            new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
        ];

        if(production) plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: true,
            exclude: [/(node_modules|web_modules)/]
        }));

        return plugins;
    }()),
    module: {
        loaders: [
            {
                test: /.*src.*\.ts$/,
                exclude: /(node_modules|web_modules)/,
                loader: 'ts-loader'
            },
            {
                test: /\.css$/,
                exclude: /\.styles\.css/,
                loaders: ['style','css']
            },
            {
                test: /\.styles\.css$/,
                loader: 'raw'
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'base64-font'
            },
            {
                test: /\.html$/,
                exclude: [/(node_modules|web_modules)/,/\.template\.html/],
                loader: 'html'
            },
            {
                test: /\.template\.html$/,
                loader: 'raw'
            },
            {
                test: /\.md$/,
                exclude: /(node_modules|web_modules)/,
                loaders: ['html','markdown']
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file',
                query: {
                    name: 'res/[hash].[ext]'
                }
            },
            {
                test: /\.json$/,
                loader: 'json'
            },

            // file loaders
            {
                test: 'README.md',
                loader: 'html?root=.!markdown'
            }
        ]
    },
    devtool: production? undefined : "source-map"
}
