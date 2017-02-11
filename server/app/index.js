var path = require('path');

// call the packages we need
var express = require('express');

// create the app
var router = express.Router();

// add the api
router.use('/static', express.static(path.join(__dirname, '../../dist/static')));
router.get('*', function(req, res){
	res.sendFile(path.join(__dirname, '../../dist', 'index.html'))
});

module.exports = router;
