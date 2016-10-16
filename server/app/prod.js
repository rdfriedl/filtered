// call the packages we need
var express = require('express');

// create the app
var router = express.Router();

// add the api
router.use(express.static('build'));

module.exports = router;
