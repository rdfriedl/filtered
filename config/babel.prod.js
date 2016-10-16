module.exports = {
	// Don't try to find .babelrc because we want to force this configuration.
	babelrc: false,
	presets: [
		'babel-preset-latest',
		'babel-preset-react'
	],
	plugins: [
		'babel-plugin-transform-class-properties',
		'babel-plugin-transform-object-rest-spread',
		['babel-plugin-transform-regenerator', {
			// Async functions are converted to generators by preset-latest
			async: false
		}],
		// Polyfills the runtime needed for async/await and generators
		['babel-plugin-transform-runtime', {
			helpers: false,
			polyfill: false,
			regenerator: true
		}]
	]
};
