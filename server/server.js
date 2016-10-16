var express = require('express');

const port = process.env.PORT || 8080;
var app = express();

// add the api
app.use('/', require('./app/index.js'));
app.use('/api', require('./api/index.js'));

// start
app.listen(port);
console.log('server started on port: ' + port);
