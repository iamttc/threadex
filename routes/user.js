var express = require('express');
var router = express.Router();
var firebase = require('../firebase').firebase;
var db = require('../firebase').db;

// for /user
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

// routes
router.get('/', function(req, res){
	content = {
		title: 'User Registration',
		desc: 'Create an account to join the Threadex action!'
	};
	res.render('user', {
		content: content
	});
});

// router.get('/:name', function(req, res) {
// 	var ref = db.ref('/t' + req.url);
// 	ref.on('value', function(snapshot) {
// 	 	res.render('t', {
// 			content: snapshot.val()
// 		});
// 	});
// });


module.exports = router;
