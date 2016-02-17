$(document).ready(function(){
	var socket = io.connect('http://localhost:1337');

	
	$('.channel-list').hide();
	$('.game').hide();


	var userC = {};
	var users = [];

	$('#btn-connect').click(function(){
		userC.username = $('#connection_pseudo').val();
		socket.emit('login',{
			username : userC.username
		});
	});

	socket.on('login',function(data){
		if(data.state == 'ok'){
			userC = data.userC;
			users = data.users;
			console.log(userC);
			console.log(users);
			alert('vous êtes connecté');
			$('.login').hide();
			$('.channel-list').show();
			$('#username').html(userC.username);
		}else if(data.state == 'error'){
			alert(data.message);
		}
	});


	// var canvas = document.getElementById('canvas');
	// var ctx = canvas.getContext('2d');
	// var mouse = {
	// 	X : 0,
	// 	Y : 0,
	// 	click : 0
	// }

	// $(document).mousemove(function(e){
	// 	console.log('test');

	// 	canvas_X = canvas.offsetLeft;
	// 	canvas_Y = canvas.offsetTop;
	// 	nextMouseX = e.clientX - canvas_X;
	// 	nextMouseY = e.clientY - canvas_Y;
	// 	if(mouse.click){
	// 		// ctx.beginPath();
	// 		// ctx.moveTo(mouse.X,mouse.Y);
	// 		// ctx.lineTo(nextMouseX,nextMouseY);
	// 		// ctx.stroke();
	// 		// ctx.closePath();
	// 		socket.emit(
	// 			'draw',
	// 			{xa:mouse.X, ya:mouse.Y, xb:nextMouseX, yb:nextMouseY}
	// 		);
	// 	}
	// 	mouse.X = nextMouseX;
	// 	mouse.Y = nextMouseY;
	// });

	// $(document).mousedown(function(){
	// 	console.log('mousedown');
	// 	mouse.click = true;
	// });
	// $(document).mouseup(function(){
	// 	console.log('mouseup');
	// 	mouse.click = false;
	// });

	// socket.on('serverDraw',function(params){
	// 	ctx.beginPath();
	// 	ctx.moveTo(params.xa,params.ya);
	// 	ctx.lineTo(params.xb,params.yb);
	// 	ctx.stroke();
	// 	ctx.closePath();
	// });

	

});

