var canvas;
var ctx;
var playing;
var win_state = false;

// 2D
// x ------> +
// y 0
// |
// |
// v +

function init()
{
	canvas = document.getElementById("mainCanvas");
	ctx = canvas.getContext('2d');
	
	playing = true;
	var grid = new Grid();
	grid.init();
	grid.putHints();
	
	var reset = document.getElementById('reset');
	reset.onclick = function() {
		grid.reset();
		listenToClicks(grid);
	}
	
	listenToClicks(grid);
}


//---------------------------------------------------
// THIS IS A HELPER FUNCTION FOR CLICK EVENT
//---------------------------------------------------
function listenToClicks(grid)
{
	canvas.addEventListener("mousedown", function(e) 
		{
		var tile = grid.tiles;
		var x = Math.floor(e.clientX / 32 - 0.35);
		var y = Math.floor(e.clientY / 32 - 0.35);
		
		// Y is the Row(i), X is the column(j)
		grid.flip(x, y);
		if(playing == false)
		{
			this.removeEventListener('mousedown',arguments.callee,false);
			grid.reveal();
		}
		
		if(win_state == true) 
		{
			this.removeEventListener('mousedown',arguments.callee,false);
			console.log("You WIN!");
			grid.win();
		}
		
		}, 
		false);
}

//---------------------------------------------------
// GRID CLASS
//---------------------------------------------------
function Grid()
{
	this.minecounter = 0;
	this.tiles = [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
	];
	
	console.log("ROW: ", this.tiles.length);
	console.log("COLUMN: ", this.tiles[0].length);
	
	this._row = this.tiles.length;
	this._col = this.tiles[0].length;
	this._mine_count;
	this._tiles_revealed;

}


Grid.prototype.init = function() 
{
	this._mine_count = 0;
	this._tiles_revealed = 0;
	playing = true;
	win_state = false;
	
	for(var i = 0; i  < this._row; i++)
	{
		for(var j = 0; j < this._col; j++)
		{
			this.tiles[i][j] = new Tile();
			this.tiles[i][j]._ypos = i * 32;
			this.tiles[i][j]._xpos = j * 32;
			
			// RANDOM MINES
			var randNumber = Math.floor((Math.random() * 300));
			if(randNumber < 35) 
			{ 
				this.tiles[i][j]._value = 9;
				this._mine_count++;
			}
			
			this.tiles[i][j].draw();
		}
	}
}

Grid.prototype.putHints = function()
{
	for(var i = 0; i  < this._row; i++)
	{
		for(var j = 0; j < this._col; j++)
		{
			if(this.tiles[i][j]._value == 0)
			{
				this.checkSurroundings(i, j);
			}
		}
	}
}


Grid.prototype.checkSurroundings = function(i, j)
{
	// console.log(i, j);
	var tile = this.tiles;
	
	// TOP LEFT
	if(i-1 > -1 && j-1 > -1) 
	{
		if(tile[i-1][j-1]._value == 9) tile[i][j]._value++;
	}
	
	// BOTTOM LEFT
	if(i-1 > -1 && j+1 < 20)
	{
		if(tile[i-1][j+1]._value == 9) tile[i][j]._value++;
	}
	
	// TOP RIGHT
	if(i+1 < 15 && j-1 > -1)
	{
		if(tile[i+1][j-1]._value == 9) tile[i][j]._value++;
	}
	
	// BOTTOM RIGHT
	if(i+1 < 15 && j+1 < 20)
	{
		if(tile[i+1][j+1]._value == 9) tile[i][j]._value++;
	}
	
	// TOP MID
	if(j-1 > -1)
	{
		if(tile[i][j-1]._value == 9) tile[i][j]._value++;
	}
	
	// BOTTOM MID
	if(j+1 < 20)
	{
		if(tile[i][j+1]._value == 9) tile[i][j]._value++;
	}
	
	// RIGHT MID
	if(i-1 > -1)
	{
		if(tile[i-1][j]._value == 9) tile[i][j]._value++;
	}
	
	// LEFT MID
	if(i+1 < 15)
	{
		if(tile[i+1][j]._value == 9) tile[i][j]._value++;
	}
	
	if(tile[i][j]._value == 9) return;
}


Grid.prototype.flip = function(i, j)
{
	// i is going right or x
	// j is going down or y
	
	if(i == -1) return;
	if(j == -1) return;
	if(i >= 20) return;
	if(j >= 15) return;
	if(this.tiles[j][i]._is_covered == false) return;
	
	this.tiles[j][i].flip();
	if(this.tiles[j][i]._value < 9) this._tiles_revealed++;
	
	// WIN CONDITION
	if((this._tiles_revealed + this._mine_count) == (this._row * this._col)) win_state = true;
	
	if(this.tiles[j][i]._value != 0) return;
	
	this.flip(i+1, j);
	this.flip(i-1, j);
	this.flip(i, j-1);
	this.flip(i, j+1);
	
	this.flip(i-1, j-1);
	this.flip(i+1, j+1);
	this.flip(i-1, j+1);
	this.flip(i+1, j-1);
}


Grid.prototype.reveal = function()
{
	for(var i = 0; i < 15; i++)
	{
		for(var j = 0; j < 20; j++)
		{
			if(this.tiles[i][j]._value == 9)
			{
				this.tiles[i][j].flip();
			}
		}
	}
}

Grid.prototype.win = function()
{
	for(var i = 0; i < 15; i++)
	{
		for(var j = 0; j < 20; j++)
		{
			if(this.tiles[i][j]._value == 9)
			{
				this.tiles[i][j]._value = 11;
				this.tiles[i][j].flip();
			}
		}
	}
}

Grid.prototype.reset = function()
{
	this.init();
	this.putHints();
}

//---------------------------------------------------




//---------------------------------------------------
// TILE CLASS
//---------------------------------------------------
function Tile() 
{
	
	this._xpos = 0;
	this._ypos = 0;
	this._is_covered = true;
	this._value = 0;
	this._images = [
		'img/zero.png',
		'img/one.png',
		'img/two.png',
		'img/three.png',
		'img/four.png',
		'img/five.png',
		'img/six.png',
		'img/seven.png',
		'img/eight.png',
		'img/mine.png',
		'img/cover.png',
		'img/flag.png'
	];
	this._texture = new Image();
}

Tile.prototype.draw = function()
{
	this.loadImage(this._value);
	ctx.drawImage(this._texture, this._xpos, this._ypos);
}

Tile.prototype.loadImage = function(pImage) 
{
	if(this._is_covered == true)
	{
		this._texture.src = this._images[10];
	} else {
		this._texture.src = this._images[pImage];
	}
	
	var self = this;
	this._texture.onload = function()
	{
		self.draw();
	}
}

Tile.prototype.flip = function()
{
	if(this._value == 9) playing = false;
	this._is_covered = false;
	this.draw();
}
