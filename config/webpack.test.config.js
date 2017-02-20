var path = require('path');
var base = require('./webpack.base.config.js');
var merge = require('webpack-merge');

module.exports = merge(base, {
	entry: [
		path.resolve(__dirname, '../test/index.js')
	],
	output: {
		filename: '[name].test.js'
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				enforce: 'pre',
				include: [
					path.resolve(__dirname, '../test/'),
					path.resolve(__dirname, '../src/')
				],
				loader: 'eslint-loader'
			}
		]
	},
	bail: true,
	devtool: 'inline-source-map'
});
