const path = require('path');
const webpack = require("webpack");

module.exports = {
    entry: {
        index: './src/index.js',
        vendor: [
            // lib
            'reflect-metadata',
            'rxjs',
            'script!jquery',
            'script!jquery.mousewheel',
            'script!jquery.transit',
            'imports?this=>window!bootstrap',
            'imports?this=>window!script!jsplumb/dist/js/jsPlumb-1.7.9.js',
            'angular2/platform/browser',

            // css
            'jsplumb/dist/css/jsplumb.css',
            'bootstrap/dist/css/bootstrap.css',
            'bootswatch/cosmo/bootstrap.css',
            'font-awesome/css/font-awesome.css'
        ]
    },
    output: {
        filename: "[name].js"
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
    ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ['style','css']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|web_modules)/,
                loader: 'babel',
                query: require('./babel.config.js')
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'base64-font'
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|web_modules)/,
                loader: 'html'
            },
            {
                test: /\.md$/,
                exclude: /(node_modules|web_modules)/,
                loaders: ['html','markdown']
            }
        ]
    },
    resolve: {
    	root: [
    		path.resolve('./node_modules/')
    	]
    },
    devtool: "source-map"
}
