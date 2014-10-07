BaseStage = function()
{
	var swatchIndex = 0;

	var convertedSwatches = false;
	var swatches = [
		0x0000FC, 0x0078F8, 0x3CBCFC, 0x0078F8, 0x0000FC,
		0x940084, 0xD800CC, 0xF878F8, 0xD800CC, 0x940084,
		0xA81000, 0xF83800, 0xF87858, 0xF83800, 0xA81000,
		0x503000, 0xAC7C00, 0xF8B800, 0xAC7C00, 0x503000,
		0x007800, 0x00B800, 0xB8F818, 0x00B800, 0x007800
	];

	this.fadeTiles = null;
	this.curFadeVal;

	this.particles = [];

	this.setFadeTiles = function(val)
	{
		if (!this.fadeTiles)
		{
			var tileSize = new Vector2i(40, 40);
			this.fadeTiles = this.add(new Tilemap(tileSize, graphics.size.divVec(tileSize)), Number.MAX_VALUE);
		}

		var iVal = Math.round(Math.max(0.0, Math.min(1.0, val)) * 6.0);

		if (iVal == this.curFadeVal) return;

		this.curFadeVal = iVal;

		var image = graphics.getImage("transition", iVal);
		var swatch = graphics.palette.findSwatch(0x000000, 0x000000, 0x000000);

		for (var r = 0; r < this.fadeTiles.rows; ++r)
		{
			for (var c = 0; c < this.fadeTiles.columns; ++c)
			{
				this.fadeTiles.setTile(c, r, image, swatch);
			}
		}
	}

	this.nextSwatch = function()
	{
		swatchIndex = (swatchIndex + 1) % swatches.length;

		this.onSwatchChanged(this.getCurrentSwatch());
	}

	this.getCurrentSwatch = function()
	{
		if (!convertedSwatches)
		{
			convertedSwatches = true;

			for (var i = 0; i < swatches.length; ++i)
			{
				var clr = swatches[i];
				swatches[i] = graphics.palette.findSwatch(clr, clr, clr);
			}
		}

		return swatches[swatchIndex];
	}

	this.addParticle = function(origin, velocity, lifetime)
	{
		this.particles.push(new Particle(origin, velocity, lifetime));
	}

	this.onSwatchChanged = function(swatch)
	{

	}
}

BaseStage.prototype.onUpdate = function()
{
	var indices = [];

	for	(var i = 0; i < this.particles.length; i++)
	{
		this.particles[i].update(this.timestep);

		if (this.particles[i].shouldRemove())
		{
			indices.push(i);
		}
	}

	for	(var i = 0; i < indices.length; i++)
	{
		this.particles.splice(indices[i], 1);
	}

	this.setFadeTiles(1.0);
}

BaseStage.prototype.onRender = function()
{
	for	(var i = 0; i < this.particles.length; i++)
	{
		var position = this.particles[i].position;
		graphics.drawPoint(0, 1, new Vector2i(position.x, position.y));
	}
}