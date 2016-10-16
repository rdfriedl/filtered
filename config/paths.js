var path = require('path');

// We support resolving modules according to `NODE_PATH`.
// This lets you use absolute paths in imports inside large monorepos:
// https://github.com/facebookincubator/create-react-app/issues/253.

// It works similar to `NODE_PATH` in Node itself:
// https://nodejs.org/api/modules.html#modules_loading_from_the_global_folders

// We will export `nodePaths` as an array of absolute paths.
// It will then be used by Webpack configs.
// Jest doesn’t need this because it already handles `NODE_PATH` out of the box.

var nodePaths = (process.env.NODE_PATH || '')
	.split(process.platform === 'win32' ? ';' : ':')
	.filter(Boolean)
	.map(p => path.resolve(p));

// config after eject: we're in ./config/
module.exports = {
	appBuild: path.resolve('build'),
	appHtml: path.resolve('src/index.html'),
	appPackageJson: path.resolve('package.json'),
	appSrc: path.resolve('src'),
	appNodeModules: path.resolve('node_modules'),
	ownNodeModules: path.resolve('node_modules'),
	nodePaths: nodePaths
};
