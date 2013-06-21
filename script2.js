function init()
{
	var canvas = document.getElementById('mainCanvas');
	var ctx = canvas.getContext('2d');
	var images = [
		'img/cover.png',
		'img/one.png',
		'img/two.png',
		'img/three.png'
	];
	
	var img = new Image();
	img.onload = function() {
		console.log("LOADED");
	}
	
	var counter = 0;
	setInterval(function(){
		img.src = images[counter];
		ctx.drawImage(img, 0 , 0);
		if(counter == 3) counter = 0;
		counter++;
	}, 1000);
	
	
	
}