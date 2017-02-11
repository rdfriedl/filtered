var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();

// configure app to use bodyParser()
// this will let us get the data from a POST
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get('/message', function(req, res) {
    res.json({message: 'hooray! welcome to our api!'});
});

router.get('*', function(req, res){
	res.json({
		error: true,
		message: 'no route '+req.path
	})
})

module.exports = router;
