//! require "BaseStage.js"

AttractStage = function(demo)
{
	demo.isLooping = true;

	this.frame = 0;

	this.lastInsertCoinFlash = 0;
	this.lastSwatchChange = 0;

	this.title = null;
	this.insertCoin = null;
}

AttractStage.prototype = new BaseStage();

AttractStage.prototype.onEnter = function()
{
	var text = graphics.getImage("title");

	this.title = this.add(new Sprite(text, this.getCurrentSwatch()), 0);
	this.title.position = graphics.size.sub(this.title.size).div(2).sub(Vector2i.UNIT_Y.mul(8));

	text = graphics.getImage("insertcoin");

	var swatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

	this.insertCoin = this.add(new Sprite(text, swatch), 0);
	this.insertCoin.position = graphics.size.sub(this.insertCoin.size).div(2).sub(Vector2i.UNIT_Y.mul(graphics.height / 4));

	this.fadeIn(0.25);
}

AttractStage.prototype.onUpdate = function()
{
	BaseStage.prototype.onUpdate.call(this);

	++this.frame;

	if (game.time - this.lastInsertCoinFlash > 1 / 2)
	{
		this.lastInsertCoinFlash = game.time;
		this.insertCoin.isVisible = !this.insertCoin.isVisible;
	}

	if (game.time - this.lastSwatchChange > 1 / 16.0)
	{
		this.lastSwatchChange = game.time;
		this.nextSwatch();
	}

	if (controls.a.justPressed || controls.b.justPressed ||
		controls.start.justPressed || controls.select.justPressed || !controls.analog.isZero)
	{
		var showScores = controls.b.isDown;

		if (showScores)
		{
			game.showHighscores();
		}
		else
		{
			game.start();
		}
	}
}

AttractStage.prototype.onSwatchChanged = function(swatch)
{
	this.title.swatch = swatch;
}

AttractStage.prototype.onRender = function()
{
	demo.render(graphics, audio, this.frame, 0.25);
}
