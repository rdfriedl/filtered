const path = require('path');

module.exports = {
    output: {
        filename: "index.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'base64-font-loader'
            }
        ]
    },
    resolve: {
    	root: [
    		path.resolve('./node_modules/')
    	]
    }
}
