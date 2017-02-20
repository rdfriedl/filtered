var path = require('path');
var webpack = require('webpack');
var base = require('./webpack.base.config.js');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = merge(base, {
	// Don't attempt to continue if there are any errors.
	bail: true,
	// In production, we only want to load the polyfills and the app code.
	entry: {
		main: path.resolve(__dirname, '../src/index.js')
	},
	externals: {
		jquery: '$',
		tether: 'Tether',
		bootstrap: true,
		react: 'React',
		'react-dom': 'ReactDOM',
		mobx: 'mobx',
		'mobx-react': 'mobxReact'
	},
	plugins: [
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, '../src/index.html'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeRedundantAttributes: true,
				useShortDoctype: true,
				removeEmptyAttributes: true,
				removeStyleLinkTypeAttributes: true,
				keepClosingSlash: true,
				minifyJS: true,
				minifyCSS: true,
				minifyURLs: true
			}
		}),
		// Minify the code.
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				screw_ie8: true, // React doesn't support IE8
				warnings: false
			},
			mangle: {
				screw_ie8: true
			},
			output: {
				comments: false,
				screw_ie8: true
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module) {
				// this assumes your vendor imports exist in the node_modules directory
				return module.context && module.context.indexOf('node_modules') !== -1;
			}
		}),
		new webpack.optimize.CommonsChunkPlugin({
			names: ['vendor', 'manifest']
		})
		// // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
		// new ExtractTextPlugin('static/css/[name].[contenthash:8].css')
	]
});
