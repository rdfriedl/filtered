const path = require('path');
const webpack = require('webpack');
const base = require('./webpack.base.config.js');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge.smart(base, {
	entry: path.resolve(__dirname, '../src/index.js'),
	plugins: [
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			template: path.join(__dirname, '../src/index.html')
		}),
		// This is necessary to emit hot updates
		new webpack.HotModuleReplacementPlugin()
	],
	// This makes the bundle appear split into separate modules in the devtools.
	// We don't use source maps here because they can be confusing:
	// https://github.com/facebookincubator/create-react-app/issues/343#issuecomment-237241875
	// You may want 'cheap-module-source-map' instead if you prefer source maps.
	devtool: 'source-map',
	devServer: {
		contentBase: path.join(__dirname, '../dist'),
		stats: {colors: true},
		watchOptions: {
			ignored: /node_modules/
		},
		historyApiFallback: true,
		port: 8080
	}
});
