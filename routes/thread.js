var express = require('express');
var router = express.Router();
var db = require('../firebase').db;

// for /t
router.use(function(req, res, next) {
    console.log(req.method, '/t' + req.url);
    next();
});

// routes
router.get('/', function(req, res){
	res.redirect('/threads');
});

router.get('/:name', function(req, res) {
	var ref = db.ref('/t' + req.url);
	ref.on('value', function(snapshot) {
	 	res.render('t', {
			content: snapshot.val()
		});
	});
});


module.exports = router;
