var canvas;
var ctx;
var cellSize = 32;

function init()
{
	canvas = document.getElementById('mainCanvas');
	ctx = canvas.getContext('2d');
	
	var grid = new Grid();
	grid.draw();
	grid.initTiles();
	grid.loadTileImages();
	grid.initMines();
	grid.plantMines();
	grid.placeHints();
	// grid.cover();
	
	canvas.addEventListener("mousedown", function(e) { 
		var x = Math.floor(e.clientX / 32 - 0.35);
		var y = Math.floor(e.clientY / 32 - 0.35);
		
		// console.log(x - 1, y - 1);
		// console.log(x + 1, y + 1);
		// console.log(grid.getTile(y, x));

		var tile = grid.getTile(y, x);
		
		tile.flip(x, y);
		}, false);
	
}


// 	GRID CLASS ---------------------------------------------------
function Grid() 
{ 
	// this._map = new Array(); // storing the tile values
	this._numberofmines = 50;
	this._map = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];
	
	this._mines = [
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
		[0,0],
	]; // coordinates where the mines will be placed.
	
	for(var i = 0; i < this._numberofmines; i++) 
	{
		this._mines[i] = [1, 1];
	}
	
	this._row = this._map.length;
	this._col = this._map[0].length;
}

Grid.prototype.draw = function() 
{
	var noOfVlines = this._row;
    var noOfHLines = this._col;
    
    ctx.beginPath();
    
    // Vertical Lines
    for(var i = 0; i < noOfHLines + 1; i++)
    {
            ctx.moveTo(i * cellSize + 0.5, 0);
            ctx.lineTo(i * cellSize + 0.5, noOfVlines * cellSize);
    }
    
    // Horizontal Lines
    for(var i = 0; i < noOfVlines + 1; i++)
    {
            ctx.moveTo(0, i * cellSize + 0.5);
            ctx.lineTo(noOfHLines * cellSize, i * cellSize + 0.5);
    }
    
    ctx.strokeStyle = "#989681";
    ctx.stroke();
    // console.log("GRID.DRAW() complete: " + this._row + " x " + this._col);	
}

// INITIALIZE THE GRID AND PLACE DEFAULT VALUES 0 TILES
Grid.prototype.initTiles = function()
{
	var i, j;
	for(i = 0; i < this._row; i++)
	{
		for(j = 0; j < this._col; j++)
		{
			var tile = new Tile();
			tile._xpos = j;
			tile._ypos = i;
			this._map[i][j] = tile;
			// console.log(this._map[i][j]);
		}
	}
	
	// console.log(this._map.length);
}


// LOAD THE IMAGE FOR THE TILES
Grid.prototype.loadTileImages = function() 
{
	for(var i = 0; i < this._row; i++) 
	{
		for(var j = 0; j < this._col; j++) 
		{
			var tile = this._map[i][j];
			tile.draw(i, j);
		}
	}
}


// GET RANDOM COORDINATES TO INITIALIZE MINES
Grid.prototype.initMines = function ()
{	
	for(var i = 0; i < this._numberofmines; ) 
	{
		var temp_mine_coor = this.getRandomNumber();
		
		// console.log(temp_mine_coor, "i: " + i);
			
		if(this.check(temp_mine_coor))
		{
			// this._mines[i] = "already exists:" + temp_mine_coor;
			// console.log(temp_mine_coor + " already exists.", "i: " + i);
		} 
		else {
			this._mines[i] = temp_mine_coor;
			i = i + 1;
		}
	}
}


Grid.prototype.plantMines = function()
{
	var minestack = this._mines;
	var grid = this._map;
	var mines_count = minestack.length;
	
	// console.log(minestack[0]);
	for(var i = 0; i < mines_count; i++) 
	{
		this.plant(minestack[i]);
	}
	// console.log(grid);
}

Grid.prototype.plant = function(mine_xy)
{
	var x = mine_xy[0];
	var y = mine_xy[1];
	var gridrow = this._map.length;
	var gridcol = this._map[0].length;
	
	// console.log(x, y, gridrow, gridcol);
	
	for(var i = 0; i < gridrow; i++)
	{
		// console.log("i: " + i);
		for(var j = 0; j < gridcol; j++)
		{
			// console.log("j: " + j);
			if(x == i && j == y) 
			{
				// console.log("STOP");
				// console.log(this._map[i][j]);
				this._map[i][j]._value = 9;
				this._map[i][j].draw(i, j);
			}
		}
	}
}

// CHECK IF A MINE ALREADY EXISTS
Grid.prototype.check = function(minecoor)
{
	for(var i = 0; i < this._numberofmines; i++)
	{
		if(minecoor[0] == this._mines[i][0] && minecoor[1] == this._mines[i][1])
		{
			return true;
		}
	}
	
	return false;
}

Grid.prototype.cover = function()
{
	var gridrow = this._map.length;
	var gridcol = this._map[0].length;
	
	for(var i = 0; i < gridrow; i++)
	{
		for(var j = 0; j < gridcol; j++)
		{
			this._map[i][j]._revealed = false;
			this._map[i][j].cover(i, j);
		}
	}
}

Grid.prototype.reveal = function()
{
	var gridrow = this._row;
	var gridcol = this._col;
	// console.log("reveal", this._row, this._col);
	
	for(var i = 0; i < gridrow; i++)
	{
		for(var j = 0; j < gridcol; j++)
		{
			this._map[i][j]._revealed = true;
			this._map[i][j].draw(i, j);
		}
	}
}

Grid.prototype.getTile = function(x, y)
{
	return this._map[x][y];
}

// GET RANDOM COORDINATES FOR MINE
Grid.prototype.getRandomNumber = function()
{
	var number = [0, 0]; 
	number[0] = Math.floor((Math.random() * this._row));
	number[1] = Math.floor((Math.random() * this._col));
	return number;
}

Grid.prototype.placeHints = function()
{
	for(var i = 0; i < this._row; i++)
	{
		for(var j = 0; j < this._col; j++)
		{
			// console.log(this._map[i][j]);
			var tile = this._map[i][j];
			if(tile._value == 0)
			{
				this.checkSurrounding(i, j);
			}
		}
	}
}

Grid.prototype.checkSurrounding = function(i, j)
{
	var tile = this._map;
	// console.log(tile[i][j]); // 14 down(i) 19 right(j)
	
	
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
	
	console.log(i, j, tile[i][j]);
	tile[i][j].draw(j, i);
	
}

Grid.prototype.update = function()
{
	for(var i = 0; i < 15; i++)
	{
		for(var j = 0; j < 20; j++)
		{
			// console.log(this._map[i][j]._revealed);
			var tile = this._map[i][j];
			if(tile._revealed == true) 
			{
				console.log(i, j, "REVEAL TRUE");
			}
		}
	}
}

// 	GRID CLASS ---------------------------------------------------

function Tile()
{
	this._revealed = true;
	this._value = 0;
	this._xpos;
	this._ypos;
	
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
		'img/mine.png'
	];
	this._img = new Image();
	this._img.src = this._images[this._value];
	
	this._coverimg;
	this._valueimg;
}

Tile.prototype.draw = function(x, y) 
{
	ctx.drawImage(this._img, this._xpos * cellSize, this._ypos * cellSize);
}

Tile.prototype.cover = function(x, y)
{
	var img = new Image();
	img.onload = function() {
		ctx.drawImage(img, y * cellSize, x * cellSize);
	}
	
	if(this._revealed) 
	{
		img.src = this._valueimg.src;
	} else {
		img.src = 'img/cover.png';
	}
	
	this._coverimg = img;
}

Tile.prototype.flip = function(x, y) 
{
	// i, y = 14, j, x = 19 
	var j = x;
	var i = y;
	
	// console.log("FLIP");
	// console.log("flipping", x, y);
	// this._revealed = true;
	// FLIPPING STARTS HERE
	if(i >= 0 && i < 15 && j >= 0 && j < 20) {
		if(this._revealed == true) {
			this.draw(i, j);
			return;
		}
		
		this._revealed = true;
		this.draw(i, j);
		
		if(this._value != 0) 
		{
			this.draw(i, j);
			return;
		}
		
		if(this._value == 0)
		{
			this._revealed = true;
		}
		
		this.flip(j-1, i-1);
		this.flip(j, i-1);
		this.flip(j+1, i-1);
		this.flip(j-1, i);
		this.flip(j+1, i);
		this.flip(j-1, i+1);
		this.flip(j, i+1);
		this.flip(j+1, i+1);
		
	} else {
		return;
	}
	
	
	
	// FLIPPING ENDS HERE
	
} 




