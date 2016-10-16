if(process.env.NODE_ENV === 'dev')
	module.exports = require('./dev.js');
else
	module.exports = require('./prod.js');
