switch (String(process.env.NODE_ENV).toLowerCase()){
	case 'dev':
	case 'development':
		module.exports = require('./config/webpack.dev.config');
		break;
	case 'prod':
	case 'production':
	default:
		module.exports = require('./config/webpack.prod.config');
		break;
	case 'test':
		module.exports = require('./config/webpack.test.config');
		break;
}