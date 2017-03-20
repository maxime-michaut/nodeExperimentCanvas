var http = require('http');

httpServer = http.createServer(function(req,res){
	console.log('user connected');
});
httpServer.listen(1337);

var io = require('socket.io').listen(httpServer);
var users = [];
var words = ['arbre', 'bleu', 'sauter', 'chat', 'chien', 'loup', 'poisson', 'licorne', 'chaise', 'table', 'tabouret', 'pc', 'maison', 'point', 'pomme', 'grenouille', 'chaussure'];
var game = {
	started : null,
	word : null,
	drawer : null,
	round : 1
};
var timerCompt;
var timerIntervall;
var maxPoint;
var allFind = false;
var userFind = false;

io.sockets.on('connection',function(socket){
	console.log('new connection');
	console.log(socket.id);
	socket.on('login',function(user){
		console.log('login : ' + user.username);
		var testConnected = false;
		users.forEach(function(userS){
			if(userS.username == user.username){
				testConnected = true;
			}
		});
		if(!testConnected){
			var userN = {
				socketId : socket.id,
				username : user.username,
				score: 0,
				discover : null,
				drawer : null
			}
			users.push(userN);
			socket.emit('login', {state : 'ok', userC : userN});
			io.emit('updateUsers', users);
			if (game.started == null && users.length >= 2) {
				startGame();
			}
		}else{
			socket.emit('login', {state : 'error', message : 'username locked'});
		}
	});
	socket.on('disconnect', function(t){
		for (i=0; i<users.length; i++) {
			if (users[i].socketId == socket.id) {
				break;
			}
		}
		users.splice(users[i], 1);
		console.log(users[0]);
		io.emit('updateUsers', users);
	});
	socket.on('draw', function(params){
		socket.broadcast.emit('serverDraw',{xa:params.xa, ya:params.ya, xb:params.xb, yb:params.yb});
	});
	socket.on('testWord', function(word){
		if (game.started && timerCompt != 0) {
			if (word == game.word) {
				var nbFind = 0;
				users.forEach(function(user){
					if (user.socketId == socket.id) {
						user.discover = true;
						user.score += maxPoint;
					}
					if (user.socketId == game.drawer.socketId) {
						if (userFind) {
							user.score += 1;
						} else {
							user.score += 10;
							userFind = true;
						}
					}
					if (user.discover) {
						nbFind ++;
					}
				});
				if (nbFind == users.length - 1) {
					allFind = true;
				}
				if (maxPoint > 5) {
						maxPoint--;
				}
				verify = true;
				io.emit('updateUsers', users);
			} else {
				verify = false;
				io.emit('addListWord', word);
			}
			socket.emit('testWord', {verify:verify})
		}
	});
	// socket.on('startRound', startRound(socket));
	// socket.on('updateRound', updateRound(socket));
});

function selectDrawer() {
	return users[Math.floor(Math.random()*users.length)];
}

function selectWord() {
	return words[Math.floor(Math.random()*words.length)];
}

function startGame() {
	users.forEach(function(user){
		user.score = 0;
	});
	game.started = true;
	game.round = 1;
	startRound();
}

function timer() {
	timerCompt --;
	if (timerCompt <= 0 || allFind) {
		console.log('timerEnd');
		stopRound();
	} else {
		console.log('timerCompt');
	}
	io.emit('timer', {timer:timerCompt});
}

function startRound() {
	var oldDrawerId = (game.drawer) ? game.drawer.socketId : false;
	console.log('oldDrawerId:  '+oldDrawerId);
	game.drawer = selectDrawer();
	console.log('hypDrawerId:  '+game.drawer.socketId);
	if (oldDrawerId) {
		comt = 10;
		while (oldDrawerId == game.drawer.socketId && compt > 0) {
			compt --;
			game.drawer = selectDrawer();
			console.log('whileDrawerId:  '+game.drawer.socketId);
		}
	}
	game.word = selectWord();
	users.forEach(function(user){
		user.discover = false;
		user.drawer = false;
		if (game.drawer.socketId == user.socketId) {
			user.drawer = true;
		}
	});
	io.emit('startRound', game);
	io.emit('updateUsers', users);
	maxPoint = 10;
	timerCompt = 10;
	allFind = false;
	userFind = false;
	io.emit('timer', {timer:timerCompt});
	timerIntervall = setInterval(timer, 1000);
}

function stopRound() {
	clearInterval(timerIntervall);
	if (game.round < 10) {
		game.round++;
		io.emit('stopRound');
		setTimeout(startRound, 5000);
	} else {
		io.emit('endGame');
		setTimeout(startGame, 10000);
	}
}
