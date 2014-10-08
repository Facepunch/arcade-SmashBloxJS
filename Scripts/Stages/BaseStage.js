var swatchIndex = 0;
var convertedSwatches = false;

var swatches =
[
	0x0000FC, 0x0078F8, 0x3CBCFC, 0x0078F8, 0x0000FC,
	0x940084, 0xD800CC, 0xF878F8, 0xD800CC, 0x940084,
	0xA81000, 0xF83800, 0xF87858, 0xF83800, 0xA81000,
	0x503000, 0xAC7C00, 0xF8B800, 0xAC7C00, 0x503000,
	0x007800, 0x00B800, 0xB8F818, 0x00B800, 0x007800
];

BaseStage = function()
{
	this._fadeTiles = null;
	this._curFadeVal = 0;
	this._fadeFrameCount = 0;
	this._curFadeFrame = 0;
	this._fadingOut = false;
	this._fadeDuration = 0.25;
	
	this._particles = null;
}

BaseStage.prototype.getParticles = function()
{
	if (!this._particles) this._particles = [];
	return this._particles;
}

BaseStage.prototype.setFadeTiles = function(val)
{
	if (!this._fadeTiles)
	{
		var tileSize = new Vector2i(40, 40);
		this._fadeTiles = new Tilemap(tileSize, graphics.size.divVec(tileSize));
	}

	var iVal = Math.round(Math.max(0.0, Math.min(1.0, val)) * 6.0);

	if (iVal == this._curFadeVal) return;

	this._curFadeVal = iVal;

	var image = graphics.getImage("transition", iVal);
	var swatch = graphics.palette.findSwatch(0x000000, 0x000000, 0x000000);

	for (var r = 0; r < this._fadeTiles.rows; ++r)
	{
		for (var c = 0; c < this._fadeTiles.columns; ++c)
		{
			this._fadeTiles.setTile(c, r, image, swatch);
		}
	}
}

BaseStage.prototype.fadeIn = function(duration)
{
	this._fadeFrameCount = Math.round(duration * game.updateRate);
	this._curFadeFrame = 0;
	this._fadingOut = false;

	this.setFadeTiles(1.0);
}

BaseStage.prototype.fadeOut = function(duration)
{
	this._fadeFrameCount = Math.round(duration * game.updateRate);
	this._curFadeFrame = 0;
	this._fadingOut = true;

	this.setFadeTiles(0.0);
}

BaseStage.prototype.updateFading = function()
{
	if (this._fadeFrameCount > 0 && this._curFadeFrame < this._fadeFrameCount)
	{
		var t = this._curFadeFrame / this._fadeFrameCount;

		if (this._fadingOut)
		{
			this.setFadeTiles(t);
		}
		else
		{
			this.setFadeTiles(1.0 - t);
		}

		this._curFadeFrame++;
	}
	else
	{
		this._fadingOut = false;
	}
}

BaseStage.prototype.nextSwatch = function()
{
	swatchIndex = (swatchIndex + 1) % swatches.length;

	this.onSwatchChanged(this.getCurrentSwatch());
}

BaseStage.prototype.getCurrentSwatch = function()
{
	if (!convertedSwatches)
	{
		for (var i = 0; i < swatches.length; ++i)
		{
			var clr = swatches[i];
			swatches[i] = graphics.palette.findSwatch(clr, clr, clr);
		}

		convertedSwatches = true;
	}

	return swatches[swatchIndex];
}

BaseStage.prototype.addParticle = function(origin, velocity, lifetime)
{
	this.getParticles().push(new Particle(origin, velocity, lifetime));
}

BaseStage.prototype.onSwatchChanged = function(swatch)
{

}

BaseStage.prototype.onUpdate = function()
{
	var indices = [];
	var particles = this.getParticles();

	for	(var i = 0; i < particles.length; i++)
	{
		particles[i].update(this.timestep);

		if (particles[i].shouldRemove())
		{
			indices.push(i);
		}
	}

	for	(var i = 0; i < indices.length; i++)
	{
		particles.splice(indices[i], 1);
	}

	this.updateFading();
}

BaseStage.prototype.onRender = function()
{
	var particles = this.getParticles();

	for	(var i = 0; i < particles.length; i++)
	{
		var position = particles[i].position;
		graphics.drawPoint(0, 1, new Vector2i(position.x, position.y));
	}

	this._fadeTiles.render(graphics);
}