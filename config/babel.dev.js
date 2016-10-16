module.exports = {
	// Don't try to find .babelrc because we want to force this configuration.
	babelrc: false,
	// This is a feature of `babel-loader` for webpack (not Babel itself).
	// It enables caching results in OS temporary directory for faster rebuilds.
	cacheDirectory: true,
	presets: [
		'babel-preset-latest',
		'babel-preset-react'
	],
	plugins: [
		'babel-plugin-transform-class-properties',
		'babel-plugin-transform-object-rest-spread',
		// function* () { yield 42; yield 43; }
		['babel-plugin-transform-regenerator', {
			// Async functions are converted to generators by babel-preset-latest
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
