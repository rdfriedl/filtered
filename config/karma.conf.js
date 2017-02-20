var webpackConfig = require('./webpack.test.config.js');
delete webpackConfig.entry;

module.exports = function(config) {
	config.set({
		frameworks: ['mocha', 'sinon-chai', 'detectBrowsers', 'phantomjs-shim'],
		plugins: [
			'karma-chrome-launcher',
			'karma-edge-launcher',
			'karma-firefox-launcher',
			'karma-ie-launcher',
			'karma-safari-launcher',
			'karma-safaritechpreview-launcher',
			'karma-opera-launcher',
			'karma-phantomjs-launcher',
			'karma-phantomjs-shim',

			'karma-detect-browsers',
			'karma-mocha',
			'karma-mocha-reporter',
			'karma-sinon-chai',
			'karma-sourcemap-loader',
			'karma-webpack',
			'karma-coverage',
			'karma-coverage-html-index-reporter'
		],
		reporters: ['mocha', 'coverage', 'coverage-html-index'],
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
		singleRun: true,
		detectBrowsers: {
			usePhantomJS: true
		},
		coverageReporter: {
			type: 'html',
			dir: '../coverage/'
		}
	})
};
