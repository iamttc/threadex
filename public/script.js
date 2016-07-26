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
				show_box('Login to see favorites.', 1);
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
	$('#login').toggle(400);
}
function login(){
	show_box('Logging In...', 0);
	var email = document.getElementById('email').value;
	var password = document.getElementById('password').value;
	firebase.auth().signInWithEmailAndPassword(email, password).then(function(){
		show_box('Login Successful', 0);
		$('#login').hide(400);
		$('#loginbuttons').hide(400);
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
		else show_box('Login to post.', 1);
	}
	else show_box('Oops! Can\'t post here.', 1);
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
	show_box('Submitting Post...', 0);
	var content = $('#post').val();
	if (content == ''){
		show_box('Post can\'t be empty.', 1);
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
function hide_image(){
	$('.large-image-view').fadeOut(300, function(){
		$('.large-image-view').css('display', 'none');
	});
}

// FAVORITES STUFF
function add_favorite(){
	var user = firebase.auth().currentUser;
	if (!user){
		show_box('Login to favorite threads.', 1);
		return;
	}
	var path = location.pathname.replace('/t/', '');
	var ref = firebase.database().ref('favorites/' + user.uid);
	ref.orderByChild('path').equalTo(path).once('value', function(snapshot){
		if (snapshot.exists()){
			show_box('This thread is already in your favorites.', 1);
		} else {
			ref.push({ path: path });
			var favs;
			ref = firebase.database().ref('t/' + path);
			ref.once('value', function(snapshot){
				favs = snapshot.val().favorites + 1;
				ref.update({
					favorites: favs
				}).then(function(){
					$('#favorites').text(favs + ' Favorites');
					show_box(snapshot.val().title + ' added to favorites.', 0);
				});
			});
		}
	});
}



