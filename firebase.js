var path = require('path');
var firebase = require('firebase');
firebase.initializeApp({
	serviceAccount: path.join(__dirname, 'threadex-f10724c3668e.json'),
	databaseURL: 'https://threadex-a2b80.firebaseio.com'
});
var db = firebase.database();
module.exports.firebase = firebase;
module.exports.db = db;
