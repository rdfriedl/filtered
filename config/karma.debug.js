var webpackConfig = require('./webpack.test.config.js');
delete webpackConfig.entry;

module.exports = function(config) {
	config.set({
		frameworks: ['mocha', 'sinon-chai'],
		plugins: [
			'karma-chrome-launcher',

			'karma-mocha',
			'karma-mocha-reporter',
			'karma-sinon-chai',
			'karma-sourcemap-loader',
			'karma-webpack',
			'karma-coverage'
		],
		reporters: ['mocha', 'coverage'],
		// this is the entry file for all our tests.
		files: [
			'../test/index.js'
		],
		browsers: ['Chrome'],
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
		singleRun: false,
		mochaReporter: {
			output: 'autowatch'
		},
		coverageReporter: {
			type: 'html', // produces a html document after code is run
			dir: '../coverage/',
			subdir: '.'
		}
	})
};
