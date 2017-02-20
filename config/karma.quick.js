var webpackConfig = require('./webpack.dev.config.js');
delete webpackConfig.entry;
webpackConfig.devtool = 'inline-source-map';
webpackConfig.bail = true;

module.exports = function(config) {
	config.set({
		frameworks: ['mocha', 'sinon-chai', 'phantomjs-shim'],
		plugins: [
			'karma-phantomjs-launcher',
			'karma-phantomjs-shim',

			'karma-mocha',
			'karma-mocha-reporter',
			'karma-sinon-chai',
			'karma-sourcemap-loader',
			'karma-webpack'
		],
		browsers: ['PhantomJS'],
		// this is the entry file for all our tests.
		files: [
			'../test/index.js'
		],
		// we will pass the entry file to webpack for bundling.
		preprocessors: {
			'../test/index.js': ['webpack', 'sourcemap']
		},
		// use the webpack config
		webpack: webpackConfig,
		// avoid walls of useless text
		webpackMiddleware: {
			noInfo: true
		},
		singleRun: true
	})
};
