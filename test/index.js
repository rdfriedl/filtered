// polyfills
require('./polyfills.js');

// import all the tests
var testsContext = require.context('.', true, /\.spec$/)
testsContext.keys().forEach(testsContext);
