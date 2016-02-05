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

io.sockets.on('connection',function(socket){
	console.log('new connection'); 
	socket.on('login',function(user){
		console.log('on');
		io.sockets.emit('newuser',{username:username});
	});
	
});