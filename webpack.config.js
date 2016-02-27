const path = require('path');
const fs = require('fs');

module.exports = {
    output: {
        filename: "index.js",
        sourceMapFilename: "index.map"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "css-loader"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|web_modules)/,
                loader: 'babel-loader',
                query: JSON.parse(fs.readFileSync('./.babelrc', 'utf-8'))
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'base64-font-loader'
            },
            {
                test: /\.html$/,
                exclude: /(node_modules|web_modules)/,
                loader: 'html-loader'
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
