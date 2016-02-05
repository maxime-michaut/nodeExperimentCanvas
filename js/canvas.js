var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');


var mouse = {
	X : 0,
	Y : 0,
	click : 0
}

function mousemovement(e){
	canvas_X = canvas.offsetLeft;
	canvas_Y = canvas.offsetTop;
	nextMouseX = e.clientX - canvas_X;
	nextMouseY = e.clientY - canvas_Y;
	if(mouse.click){
		ctx.beginPath();
		ctx.moveTo(mouse.X,mouse.Y);
		ctx.lineTo(nextMouseX,nextMouseY);
		ctx.stroke();
		ctx.closePath();
	}
	mouse.X = nextMouseX;
	mouse.Y = nextMouseY;
}

canvas.addEventListener('mousemove', mousemovement);

canvas.onmousedown = function(){
	mouse.click = true;
}
canvas.onmouseup = function(){
	mouse.click = false;
}
