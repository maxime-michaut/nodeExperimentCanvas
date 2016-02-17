var http = require('http');


httpServer = http.createServer(function(req,res){
	console.log('user connected');
});
httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);

// io.sockets.on('connection', function(socket){
// 	console.log('new connection');

// 	var me;
// 	socket.on('test',function(user){
// 		console.log(user.pseudo);
// 		me = user.pseudo;
// 		socket.broadcast.emit('newuser',me);
// 	});
// });

/** Passerelle canvas **/
// io.sockets.on('connection',function(socket){
// 	console.log('new connection'); 
// 	socket.on('draw',function(params){
// 		console.log(params.xa);
// 		console.log(params.ya);
// 		console.log(params.xb);
// 		console.log(params.yb);
// 		socket.broadcast.emit('serverDraw',{xa:params.xa, ya:params.ya, xb:params.xb, yb:params.yb});
// 	});
	
// });

var users = [];
var channels = [
	{
		id : 1, name : 'Easy'
	},
	{
		id : 2, name : 'Medium'
	},
	{
		id : 3, name : 'Hard'
	}
];

// cette fonction n'est pas accessible dans io.sockets.on( socke.on ).
// function uniqid(){
// 	var a = Math.floor(Math.random()*1000);
// 	var b = Math.floor(Math.random()*1000);
// 	var c = Math.floor(Math.random()*1000);
// 	var d = Math.floor(Math.random()*1000);

// 	return '-'+a+b+c+d;
// }

io.sockets.on('connection',function(socket){
	console.log('new connection');

	socket.on('login',function(user){
		console.log('login : ' + user.username);

		var testConnected = false;
		users.forEach(function(userS){
			if(userS.username == user.username){
				testConnected = true;
			}
		});
		if(!testConnected){
			var a = Math.floor(Math.random()*1000);
			var b = Math.floor(Math.random()*1000);
			var c = Math.floor(Math.random()*1000);
			var d = Math.floor(Math.random()*1000);
			var uniqid = '-'+a+b+c+d;
			var userN = {
				id : uniqid,
				username : user.username
			}
			users.push(userN);
			socket.emit('login', {state : 'ok', users : users, userC : userN});
		}else{
			socket.emit('login', {state : 'error', message : 'username locked'});
		}
	});
	
});