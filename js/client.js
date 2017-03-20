	var socket = io.connect('http://localhost:1337');

	$('.game').hide();

	var userC = {};

	$('#form-login').submit(function(e) {
		e.preventDefault();
		userC.username = $('#connection_pseudo').val();
		socket.emit('login',{
			username : userC.username
		});
	});

	socket.on('login', function(data){
		if(data.state == 'ok'){
			userC = data.userC;
			$('.login').hide();
			$('.game').show();
			$('#username').html(userC.username);
		}else if(data.state == 'error'){
			alert(data.message);
		}
	});

	socket.on('startRound', function(data){
		$('.round').html(data.round);
		ctx.clearRect(0,0,canvas.width,canvas.height);
		if (data.drawer.socketId == userC.socketId) {
			$('.drawer').html('Tu dessines');
			$('.word').html(data.word);
		} else {
			$('.drawer').html(data.drawer.username);
			var word = '';
			for (i=0; i<data.word.length; i++) {
				word += '_ ';
			}
			$('.word').html(word);
		}
	});

	socket.on('timer', function(data){
		$('.timer').html(data.timer);
	});

	$('input[name=inputWord]').keydown(function(e){
		if (e.keyCode == 13) {
			var word = $('input[name=inputWord]').val();
			if (word.length) {
				socket.emit('testWord', word);
				$('input[name=inputWord]').val('');
			}
		}
	});

	socket.on('testWord', function(data){
		if (data.verify == true) {
			$('.verify').html('trouvé');
			$('.word').html('word');
		} else {
			$('.verify').html('nop');
		}
	})

	socket.on('updateUsers', function(users) {
		$('.listUser').html('');
		if (users.length != 0) {
			users.forEach(function(user){
				element = '<li ';
				if (user.drawer == true) {
					element += 'class="drawerUser"';
				}
				if (user.discover == true) {
					element += 'class="discover"';
				}
				element += '>'+user.username+'<span class="score">'+user.score+'</span></li>';
				$('.listUser').append(element);
			});
		}
	});

	socket.on('stopRound', function(data){
		$('.timer').html('next round soon');
	});

	socket.on('endGame', function(data){
		$('.winner').html(data.username + 'a gagné avec ' + data.score + 'points');
	});

	socket.on('serverDraw',function(data){
		canvasDraw(data.xa, data.ya, data.xb, data.yb);
	});

	socket.on('addListWord', function(word){
		$('.listWord').append('<div>'+word+'</div>');
		$('.listWord').scrollTop($('.listWord')[0].scrollHeight);
	});
