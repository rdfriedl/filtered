// call the packages we need
var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var webpackConfig = require('../../config/webpack.config.dev.js');

// create the app
var router = express.Router();
var compiler = webpack(webpackConfig);

// add the api
router.use(webpackDevMiddleware(compiler, {
	publicPath: webpackConfig.output.publicPath,
	stats: {colors: true},
	quiet: true,
	watchOptions: {
		ignored: /node_modules/
	},
	hot: true
}));

router.use(webpackHotMiddleware(compiler, {
	log: console.log
}));

module.exports = router;
