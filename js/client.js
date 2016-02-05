$(document).ready(function(){

	var socket = io.connect('http://localhost:1337');

	$('.game').hide();
	$('.salon').hide();

	$('#btn-connect').click(function(){
		username = $('input[name=connection_pseudo]').val();
		console.log($('input[name=connection_pseudo]').val());
		socket.emit('login',{
			username : username
		});
	});

	socket.on('newuser',function(user){
		console.log(user)
		alert(user.username+' viens de se connecter');
	});
});

