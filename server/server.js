var express = require('express');

var app = express();

// add the api
app.use('/', require('./app/index.js'));
app.use('/api', require('./api/index.js'));

// openshift health report
app.get('/health', function(req, res){
	res.send('hello world');
});

// start
const port = process.env.NODE_PORT || 8080;
const host = process.env.NODE_IP || 'localhost';
app.listen(port, host);
console.log('server started on port: ' + port);
