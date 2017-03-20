var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var mouse = {
	X : 0,
	Y : 0,
	click : 0
}

function mousemovement(e){
	canvas_X = document.getElementById('canvas').offsetLeft;
	canvas_Y = canvas.offsetTop;
	console.log(canvas.offsetLeft);
	nextMouseX = e.clientX - canvas_X;
	nextMouseY = e.clientY - canvas_Y;
	if(mouse.click){
		canvasDraw(mouse.X, mouse.Y, nextMouseX, nextMouseY);
		socket.emit(
			'draw',
			{xa:mouse.X, ya:mouse.Y, xb:nextMouseX, yb:nextMouseY}
		);
	}
	mouse.X = nextMouseX;
	mouse.Y = nextMouseY;
	console.log(mouse.X);
	console.log(mouse.Y);
}

function canvasDraw(xa, ya, xb, yb) {
	ctx.beginPath();
	ctx.moveTo(xa, ya);
	ctx.lineTo(xb, yb);
	ctx.stroke();
	ctx.closePath();
}

canvas.addEventListener('mousemove', mousemovement);

canvas.onmousedown = function(){
	mouse.click = true;
}
canvas.onmouseup = function(){
	mouse.click = false;
}
