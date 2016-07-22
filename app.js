// packages
var express = require('express');
var http = require('http');
var pug = require('pug');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./firebase');

// app config
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// middleware
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
var general = require('./routes/general');
app.use('/', general);
var thread = require('./routes/thread');
app.use('/t', thread);
var user = require('./routes/user');
app.use('/user', user);

// 404
app.use(function(req, res){
    res.render('404');
});

// start on port
app.listen(app.get('port'), function() {
	console.log('listening on port ' + app.get('port'));
});
