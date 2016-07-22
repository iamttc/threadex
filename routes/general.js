var express = require('express');
var router = express.Router();
var firebase = require('../firebase').firebase;
var db = require('../firebase').db;

// for /
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

router.get('/', function(req, res) {
	var content = {
		title: 'Threadex Home',
		desc: 'The Threadex home page. Stay up to date on developments and new features.'
	};
	res.render('home', {
		content: content
	});
});

router.get('/threads', function(req, res){
	content = {
		title: 'Threads',
		desc: 'A list of all threads in our database.'
	};
	var ref = db.ref('t');
	ref.on('value', function(snapshot){
		res.render('threads', {
			content: content,
			threads: snapshot.val()
		});
	});
});

router.get('/create', function(req, res){
	content = {
		title: 'Create Thread',
		desc: 'Looks like you couldn\'t find what you\'re looking for. Time to start your own conversation!'
	};
 	res.render('create', {
		content: content
	});
});


router.get('/favorites', function(req, res){
	content = {
		title: 'Your Favorites',
		desc: 'Quick links to all of your favorite topics.'
	};
 	res.render('favorites', {
		content: content
	});
});


module.exports = router;

