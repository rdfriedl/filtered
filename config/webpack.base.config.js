const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const env = require('./env');

module.exports = {
	output: {
		// Next line is not used in dev but WebpackDevServer crashes without it:
		path: path.resolve(__dirname, '../dist'),
		// This does not produce a real file. It's just the virtual path that is
		// served by WebpackDevServer in development. This is the JS bundle
		// containing code from all our entry points, and the Webpack runtime.
		filename: 'js/[name].[hash:8].js',
		// In development, we always serve from the root. This makes config easier.
		publicPath: '/'
	},
	resolve: {
		// These are the reasonable defaults supported by the Node ecosystem.
		// We also include JSX as a common component filename extension to support
		// some tools, although we do not recommend using it, see:
		// https://github.com/facebookincubator/create-react-app/issues/290
		extensions: ['.js', '.json', '.jsx'],
		alias: {
			src: path.resolve(__dirname, '../src'),
			core: path.resolve(__dirname, '../src/core')
		}
	},
	plugins: [
		// Makes some environment variables available to the JS code, for example:
		// if (process.env.NODE_ENV === 'development') { ... }. See `env.js`.
		new webpack.DefinePlugin(env),
		// Watcher doesn't work well if you mistype casing in a path so we use
		// a plugin that prints an error when you attempt to do this.
		// See https://github.com/facebookincubator/create-react-app/issues/240
		new CaseSensitivePathsPlugin()
	],
	module: {
		rules: [
			// preloaders
			{
				test: /\.(js|jsx)$/,
				include: path.resolve(__dirname, '../src'),
				loader: 'eslint-loader',
				enforce: 'pre'
			},

			// Process JS with Babel.
			{
				test: /\.(js|jsx)$/,
				include: path.resolve(__dirname, '../src'),
				loader: 'babel-loader'
			},
			// "postcss" loader applies autoprefixer to our CSS.
			// "css" loader resolves paths in CSS and adds assets as dependencies.
			// "style" loader turns CSS into JS modules that inject <style> tags.
			// In production, we use a plugin to extract that CSS to a file, but
			// in development "style" loader enables hot editing of CSS.
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							plugins: function() {
								return [
									autoprefixer({
										browsers: [
											'>1%',
											'last 4 versions',
											'Firefox ESR',
											'not ie < 9', // React doesn't support IE8 anyway
										]
									})
								];
							}
						}
					}
				]
			},
			// JSON is not enabled by default in Webpack but both Node and Browserify
			// allow it implicitly so we also enable it.
			{
				test: /\.json$/,
				loader: 'json-loader'
			},
			// "file" loader makes sure those assets get served by WebpackDevServer.
			// When you `import` an asset, you get its (virtual) filename.
			// In production, they would get copied to the `build` folder.
			{
				test: /\.(ico|jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
				exclude: /\/favicon.ico$/,
				loader: 'file-loader',
				options: {
					name: 'media/[name].[hash:8].[ext]'
				}
			},
			// A special case for favicon.ico to place it into build root directory.
			{
				test: /\/favicon\.ico$/,
				include: [path.resolve(__dirname, '../src')],
				loader: 'file-loader',
				options: {
					name: 'favicon.ico?[hash:8]'
				}
			},
			// "url" loader works just like "file" loader but it also embeds
			// assets smaller than specified size as data URLs to avoid requests.
			{
				test: /\.(mp4|webm)(\?.*)?$/,
				loader: 'url-loader',
				options: {
					limit: 10000,
					name: 'media/[name].[hash:8].[ext]'
				}
			},
			// "html" loader is used to process template page (index.html) to resolve
			// resources linked with <link href="./relative/path"> HTML tags.
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.md$/,
				use: ['html-loader','markdown-loader']
			}
		]
	}
};
