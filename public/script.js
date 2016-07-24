var config = {
	apiKey: "AIzaSyB4w55QQf-eYei3gnTQtb6VbTXrw0Qjr2I",
	authDomain: "threadex-a2b80.firebaseapp.com",
	databaseURL: "https://threadex-a2b80.firebaseio.com",
	storageBucket: "threadex-a2b80.appspot.com",
};
firebase.initializeApp(config);


window.onload = function(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			$('#logoutbutton').show(600);
			if (location.pathname == '/favorites')
				update_favorites(user);
		} else {
			$('#loginbuttons').show(600);
			if (location.pathname == '/favorites'){
				var delay = 0;
				$('.item').each(function(){
					$(this).delay(delay).fadeOut(250);
					delay += 50;
				});
				$('.item').remove();
			}
		}
	});
};

// NOTIFICATION STUFF
function show_box(input, warn){
	var box = $('#alert_box');
	box.text(input);
	if (warn) box.css({'color': 'red', 'border-color': 'red'});
	else box.css({'color': '#21ce99', 'border-color': '#21ce99'});
	box.fadeIn(500);
	setTimeout(function(){
    	box.fadeOut(500);
	}, 4000);
}

// LOGIN LOGOUT STUFF
function show_login(){
	$('#login').toggle(600);
}
function login(){
	show_box('Logging In...', 0);
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
		show_box('Login Successful', 0);
		$('#login').hide(600);
		$('#loginbuttons').hide(600);
	}, function(error){
		var errorCode = error.code;
		var errorMessage = error.message;
		show_box('Login Failed: ' + errorMessage, 1);
	});
}
function logout(){
	firebase.auth().signOut().then(function() {
		$('#loginbuttons').show(600);
		$('#logoutbutton').hide(600);
		show_box('Logout Successful', 0);
	}, function(error) {
		show_box('Logout Failed: ' + error.message, 1);
	});
}

// POSTING STUFF
function show_post(){
	if (location.pathname.includes('/t/')){
		if (firebase.auth().currentUser)
			$('#createpost').toggle(600);
		else show_box('You must be logged in to post!', 1);
	}
	else show_box('Oops! Can\'t Post Here.', 1);
}
function finish_post(content, imgurl){
	console.log(imgurl);
	var ref = firebase.database().ref('posts');
	var thread = location.pathname.replace('/t/', '');
	ref.child(thread).push({
		name: firebase.auth().currentUser.displayName,
		content: content,
		date: Date(),
		imgurl: imgurl
	}).then(function(){
		location.reload();
	});
}
function submit_post(){
	var content = $('#post').val();
	if (content == ''){
		show_box('Please provide some text for your post!', 1);
		return;
	}
	var img = document.getElementById('img');
	if (img.files.length != 0){
		var file = img.files[0];
		var fileref = firebase.storage().ref('images').child(file.name).put(file);
		fileref.on('state_changed', function(snapshot){
		}, function(error) {
			show_box('Upload Failed: ' + error.message, 1);
		}, function() {
			finish_post(content, fileref.snapshot.downloadURL);
		});
	} else{
		finish_post(content, null);
	}
}

// RESULT SETS
function show_result_set(){
	$('.loading').hide();
	var delay = 0;
	$('.item').each(function(){
		$(this).delay(delay).fadeIn(250);
		delay += 50;
	});
}

// FAVORITES STUFF
function not_in_favorites(ref, path){
	flag = true;
	ref.once('value', function(snapshot){
		snapshot.forEach(function(snap){
			if (snap.val().path == path){
				show_box('This thread is already in your favorites.', 1);
				flag = false;
				return;
			}
		});
	}).then(function(){
		if (flag){
			ref.push({ path: path.replace('/t/', '') });
			var favs;
			ref = firebase.database().ref(path);
			ref.once('value', function(snapshot){
				favs = snapshot.val().favorites + 1;
				ref.update({
					favorites: favs
				}).then(function(){
					$('#favorites').text(favs + ' Favorites');
					show_box(snapshot.val().title + ' added to favorites.', 0);
				});
			});
		};
	});
}
function add_favorite(){
	var user = firebase.auth().currentUser;
	if (!user){
		show_box('Need to be logged in to favorite posts.', 1);
		return;
	}
	var path = location.pathname;
	var ref = firebase.database().ref('favorites/' + user.uid);
	not_in_favorites(ref, path);
}



