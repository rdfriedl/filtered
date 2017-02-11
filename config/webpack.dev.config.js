var path = require('path');
var webpack = require('webpack');
var base = require('./webpack.base.config.js');
var merge = require('webpack-merge');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge.smart(base, {
	entry: [
		// Include WebpackDevServer client. It connects to WebpackDevServer via
		// sockets and waits for recompile notifications. When WebpackDevServer
		// recompiles, it sends a message to the client by socket. If only CSS
		// was changed, the app reload just the CSS. Otherwise, it will refresh.
		// The "?/" bit at the end tells the client to look for the socket at
		// the root path, i.e. /sockjs-node/. Otherwise visiting a client-side
		// route like /todos/42 would make it wrongly request /todos/42/sockjs-node.
		// The socket server is a part of WebpackDevServer which we are using.
		// The /sockjs-node/ path I'm referring to is hardcoded in WebpackDevServer.
		// require.resolve('webpack-dev-server/client') + '?/',
		// Include Webpack hot module replacement runtime. Webpack is pretty
		// low-level so we need to put all the pieces together. The runtime listens
		// to the events received by the client above, and applies updates (such as
		// new CSS) to the running application.
		'webpack/hot/only-dev-server',
    	'webpack-hot-middleware/client',
		// We ship a few polyfills by default.
		// require.resolve('./polyfills'),
		// Finally, this is your app's code:
		path.resolve(__dirname, '../src/index.js')
		// We include the app code last so that if there is a runtime error during
		// initialization, it doesn't blow up the WebpackDevServer client, and
		// changing JS code would still trigger a refresh.
	],
	plugins: [
		// Generates an `index.html` file with the <script> injected.
		new HtmlWebpackPlugin({
			inject: true,
			template: path.resolve(__dirname, '../src/index.html'),
		}),
		// This is necessary to emit hot updates
		new webpack.HotModuleReplacementPlugin()
	],
	// This makes the bundle appear split into separate modules in the devtools.
	// We don't use source maps here because they can be confusing:
	// https://github.com/facebookincubator/create-react-app/issues/343#issuecomment-237241875
	// You may want 'cheap-module-source-map' instead if you prefer source maps.
	devtool: 'source-map'
});
