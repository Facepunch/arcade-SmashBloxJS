BlockGrid = function(cols, rows)
{
	this.grid = [];
	this.tiles = new Tilemap(new Vector2i(16, 8), new Vector2i(cols, rows));
	this.blockImage = null;
	this.blockSwatches = [];
	this.tileSize = new Vector2f(this.tiles.tileWidth, this.tiles.tileHeight);

	var gridSize = cols * rows;

	for (var i = 0; i < gridSize; ++i)
	{
		this.grid.push(0);
	}

	this.localBounds = new RectF(0, 0, this.tiles.width, this.tiles.height);

	this.getPhases = function() { return this.blockSwatches.length; }
	this.getColumns = function() { return this.tiles.columns; }
	this.getRows = function() { return this.tiles.rows; }
	this.getGrid = function(col, row) { return this.grid[col + row * this.getColumns()]; }
	
	this.setGrid = function(col, row, value)
	{
		if (value < 0 || value > this.getPhases())
		{
			return;
		}

		var index = col + row * this.getColumns();

		if (this.grid[index] == value)
		{
			return;
		}

		this.grid[index] = value;

		if (value > 0)
		{
			this.tiles.setTile(col, row, this.blockImage, this.blockSwatches[value - 1]);
		}
		else
		{
			this.tiles.clearTile(col, row);
		}
	}

	this.isColliding = function(pos, phase)
	{
		var block = pos.toVector2i();
		var hit = false;

		if (pos.x >= 0 && pos.x < this.getColumns() && pos.y >= 0 && pos.y <= this.getRows())
		{
			var p = this.getGrid(Math.floor(pos.x), Math.floor(pos.y));
			phase = Math.max(p, phase);
			hit = p > 0;
		}

		return { hit : hit, block : block, phase : phase }
	}

	var contains = function(arr, value)
	{
		for (var i = 0; i < arr.length; ++i)
		{
			if (arr[i].equals(value)) return true;
		}

		return false;
	}

	this.checkForCollision = function(ball)
	{
		var hit = false;
		var normal = Vector2f.ZERO;
		var phase = 0;

		//if (!ball.bounds.intersects(this.bounds)) return false;

		var bounds = ball.bounds.sub(this.position).divVec(this.tileSize);
		var collided = [];
		var collideRes;

		collideRes = this.isColliding(bounds.topLeft, phase);

		if (collideRes.hit)
		{
			hit = true;
			normal = normal.add(new Vector2f(1, -1));
			phase = collideRes.phase;

			if (!contains(collided, collideRes.block)) collided.push(collideRes.block);
		}

		collideRes = this.isColliding(bounds.topRight, phase);

		if (collideRes.hit)
		{
			hit = true;
			normal = normal.add(new Vector2f(-1, -1));
			phase = collideRes.phase;

			if (!contains(collided, collideRes.block)) collided.push(collideRes.block);
		}

		collideRes = this.isColliding(bounds.bottomLeft, phase);

		if (collideRes.hit)
		{
			hit = true;
			normal = normal.add(new Vector2f(1, 1));
			phase = collideRes.phase;

			if (!contains(collided, collideRes.block)) collided.push(collideRes.block);
		}

		collideRes = this.isColliding(bounds.bottomRight, phase);

		if (collideRes.hit)
		{
			hit = true;
			normal = normal.add(new Vector2f(-1, 1));
			phase = collideRes.phase;

			if (!contains(collided, collideRes.block)) collided.push(collideRes.block);
		}

		for (var i = 0; i < collided.length; ++i)
		{
			var p = collided[i];
			this.setGrid(p.x, p.y, this.getGrid(p.x, p.y) - 1);

			this.stage.onBlockHit();
		}

		if (normal.lengthSquared > 0.0)
		{
			normal = normal.normalized;
		}

		return { hit : hit, normal : normal, phase : phase }
	}
}

BlockGrid.prototype.onLoadGraphics = function()
{
	this.blockImage = graphics.getImage("block");

	this.blockSwatches.push(graphics.palette.findSwatch(0x0000FC, 0x0078F8, 0x3CBCFC));
	this.blockSwatches.push(graphics.palette.findSwatch(0x940084, 0xD800CC, 0xF878F8));
	this.blockSwatches.push(graphics.palette.findSwatch(0xA81000, 0xF83800, 0xF87858));
	this.blockSwatches.push(graphics.palette.findSwatch(0x503000, 0xAC7C00, 0xF8B800));
	this.blockSwatches.push(graphics.palette.findSwatch(0x007800, 0x00B800, 0xB8F818));
}

BlockGrid.prototype.onRender = function()
{
	this.tiles.x = Math.floor(this.x);
	this.tiles.y = Math.floor(this.y);

	this.tiles.render(graphics);
}