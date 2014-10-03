Paddle = function()
{
	this.endImage = null;
	this.midImage = null;

	this.leftEndSprite = null;
	this.rightEndSprite = null;
	this.midSprites = [];

	this.swatch = null;

	this.size = 0.0;
	this.sizeChanged = false;

	this.moveSpeed = 0.0;

	this.getSize = function() { return size; }
	this.setSize = function(size)
	{
		this.size = size;
		this.sizeChanged = true;

		this.localBounds = new RectF(-this.size * 4 - 2, 2, this.size * 4 + 2, 0);
	}

	this.getNextX = function()
	{
		var dx = controls.cursorPosition.x - this.x;
		var maxDx = this.moveSpeed * this.stage.timestep;

		if (dx < -maxDx) dx = -maxDx;
		else if (dx > maxDx) dx = maxDx;

		var margin = 8 + this.size * 4;

		var p = this.x + dx;

		if (p < margin) p = margin;
		if (p > graphics.width - margin) p = graphics.width - margin;

		return p;
	}
}

Paddle.prototype.onEnterStage = function()
{
	this.setSize(4);
	this.moveSpeed = 200.0;
}

Paddle.prototype.onUpdate = function()
{
	this.x = this.getNextX();
}

Paddle.prototype.onLoadGraphics = function()
{
	this.endImage = graphics.getImage("paddle", "end");
	this.midImage = graphics.getImage("paddle", "mid");

	this.swatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

	this.leftEndSprite = this.add(new Sprite(this.endImage, this.swatch));
	this.rightEndSprite = this.add(new Sprite(this.endImage, this.swatch));

	this.rightEndSprite.flipX = true;
}

Paddle.prototype.onRender = function()
{
	if (this.sizeChanged) this.resize();
}

Paddle.prototype.resize = function()
{
	this.sizeChanged = false;

	this.setSpriteOffset(this.leftEndSprite, new Vector2i(-this.size * 4 - this.leftEndSprite.width, -2));
	this.setSpriteOffset(this.rightEndSprite, new Vector2i(this.size * 4, -2));

	for	(var i = 0; i < this.midSprites.length; i++)
	{
		this.remove(this.midSprites[i]);
	}
	
	this.midSprites = [];

	for	(var i = 0; i < this.size; i++)
	{
		var midSprite = this.add(new Sprite(this.midImage, this.swatch), new Vector2i(-this.size * 4 + i * 8, -2));
		this.midSprites.push(midSprite);
	}
}