/// <reference path="BaseStage.js"/>

AttractStage = function(demo)
{
	demo.isLooping = true;

	this.frame = 0;

	this.lastInsertCoinFlash = 0;
	this.lastSwatchChange = 0;

	this.title = null;
	this.insertCoin = null;

	this.changingStage = false;
	this.showScores = false;
}

AttractStage.prototype = new BaseStage();

AttractStage.prototype.onEnter = function()
{
	var text = graphics.getImage("title");

	this.title = this.add(new GameAPI.BudgetBoy.Sprite(text, this.getCurrentSwatch()), 0);
	this.title.position = graphics.size.sub(this.title.size).div(2).sub(GameAPI.Vector2i.UNIT_Y.mul(8));

	text = graphics.getImage("insertcoin");

	var swatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

	this.insertCoin = this.add(new GameAPI.BudgetBoy.Sprite(text, swatch), 0);
	this.insertCoin.position = graphics.size.sub(this.insertCoin.size).div(2).sub(GameAPI.Vector2i.UNIT_Y.mul(graphics.height / 4));

	this.fadeIn(this._fadeDuration);
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
		if (!this.changingStage)
		{
			this.changingStage = true;
			this.showScores = controls.b.justPressed;

			this.fadeOut(this._fadeDuration);
		}
	}

	if (this.changingStage && !this._fadingOut)
	{
		if (this.showScores)
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

	BaseStage.prototype.onRender.call(this);
}
