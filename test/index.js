// polyfills
require('./polyfills.js');

// import all the tests
const testsContext = require.context('.', true, /\.spec$/);
testsContext.keys().forEach(testsContext);
