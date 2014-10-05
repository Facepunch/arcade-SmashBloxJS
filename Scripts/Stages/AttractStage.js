//! require "BaseStage.js"

AttractStage = function(demo)
{
	demo.isLooping = true;

	var frame = 0;

	var lastInsertCoinFlash = 0;
	var lastSwatchChange = 0;

	var title = null;
	var insertCoin = null;

	this.onEnter = function()
	{
		Debug.log("attract on enter");

		var text = graphics.getImage("title");

		title = this.add(new Sprite(text, this.getCurrentSwatch()), 0);
		title.position = graphics.size.sub(title.size).div(2).sub(Vector2i.UNIT_Y.mul(8));

		text = graphics.getImage("insertcoin");

		var swatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

		insertCoin = this.add(new Sprite(text, swatch), 0);
		insertCoin.position = graphics.size.sub(insertCoin.size).div(2).sub(Vector2i.UNIT_Y.mul(graphics.height / 4));
	}

	this.onUpdate = function()
	{
		++frame;

		if (game.time - lastInsertCoinFlash > 1 / 2)
		{
			lastInsertCoinFlash = game.time;
			insertCoin.isVisible = !insertCoin.isVisible;
		}

		if (game.time - lastSwatchChange > 1 / 16.0)
		{
			lastSwatchChange = game.time;
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

	this.onSwatchChanged = function(swatch)
	{
		title.swatch = swatch;
	}

	this.onRender = function()
	{
		demo.render(graphics, audio, frame, 0.25);
	}
}

AttractStage.prototype = new BaseStage();
