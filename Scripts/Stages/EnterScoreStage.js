//! require "BaseStage.js"

EnterScoreStage = function(demo, completed, score)
{
	State =
	{
		EnterInitials : 0,
		WaitForContinue : 1
	}

	this.completed = completed;
	this.score = score;

	this.headerSprite = null;
	this.newHighscoreSprite = null;

	this.charTexts = [];

	this.curChar = 0;
	this.curIndex = 0;

	this.nextSwatchTime = 0.0;
	this.curState;
	this.whiteSwatch;

	this.validChars = "_abcdefghijklmnopqrstuvwxyz0123456789".toUpperCase().split("");

	this.onSwatchChanged = function(swatch)
	{
		this.headerSprite.swatch = swatch;

		if (this.newHighscoreSprite)
		{
			this.newHighscoreSprite.swatch = swatch;
		}
	}

	this.onEnterInitials = function(textY)
	{
		var font = graphics.getImage("font");
		this.whiteSwatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

		var newHighscoreImage = graphics.getImage("newhighscore");

		this.newHighscoreSprite = this.add(new Sprite(newHighscoreImage, this.getCurrentSwatch()), 0);
		this.newHighscoreSprite.x = (graphics.width - newHighscoreImage.width) / 2;
		this.newHighscoreSprite.y = textY - newHighscoreImage.height - 16;

		var text = this.add(new Text(font, this.whiteSwatch), 0);
		text.value = "ENTER YOUR INITIALS";
		text.x = (graphics.width - text.width) / 2;
		text.y = this.newHighscoreSprite.y - text.height - 8;

		textY = text.y - text.charSize.y - 8;

		var dx = text.charSize.x + 4;
		var x = (graphics.width - dx * 3) / 2 + 2;

		this.charTexts.push(this.add(new Text(font, this.whiteSwatch), 0));
		this.charTexts[0].value = "A";
		this.charTexts[0].x = (x += dx) - dx;
		this.charTexts[0].y = textY;

		this.charTexts.push(this.add(new Text(font, this.whiteSwatch), 0));
		this.charTexts[1].value = "A";
		this.charTexts[1].x = (x += dx) - dx;
		this.charTexts[1].y = textY;

		this.charTexts.push(this.add(new Text(font, this.whiteSwatch), 0));
		this.charTexts[2].value = "A";
		this.charTexts[2].x = (x += dx) - dx;
		this.charTexts[2].y = textY;
	}

	this.updateEnterInitials = function()
	{
		this.charTexts[this.curChar].swatch = this.getCurrentSwatch();
		this.curIndex = this.validChars.indexOf(this.charTexts[this.curChar].value[0]);

		if (controls.a.justPressed || (this.curChar < 2 && controls.analog.x.justBecamePositive))
		{
			this.charTexts[this.curChar].swatch = this.whiteSwatch;
			++this.curChar;
		}
		else if (this.curChar > 0 && (controls.b.justPressed || controls.analog.x.justBecameNegative))
		{
			this.charTexts[this.curChar].swatch = this.whiteSwatch;
			--this.curChar;
		}
		else if (controls.analog.y.justBecameNegative)
		{
			this.curIndex = (this.curIndex + 1) % this.validChars.length;
			this.charTexts[this.curChar].value = this.validChars[this.curIndex];
		}
		else if (controls.analog.y.justBecamePositive)
		{
			this.curIndex = (this.curIndex + this.validChars.length - 1) % this.validChars.length;
			this.charTexts[this.curChar].value = this.validChars[this.curIndex];
		}
		else if (controls.start.justPressed)
		{
			this.curChar = 3;
		}

		if (this.curChar >= 3)
		{
			var initials = "";

			for (var i = 0; i < this.charTexts.length; ++i)
			{
				initials += this.charTexts[i].value;
			}

			game.submitAndShowHighscores(new Highscore(initials, this.score));
		}
	}

	this.flashSwatches = function()
	{
		if (game.time - this.nextSwatchTime > 1.0 / 16.0)
		{
			this.nextSwatch();
			this.nextSwatchTime = game.time;
		}
	}

	this.changeState = function(nextState)
	{
		this.curState = nextState;
	}

	this.isCurrentState = function(state)
	{
		return this.curState == state;
	}
}

EnterScoreStage.prototype = new BaseStage();

EnterScoreStage.prototype.onEnter = function()
{
	graphics.setClearColor(13);

	var headerImage = this.completed ? graphics.getImage("yourewinner") : graphics.getImage("gameover");

	this.headerSprite = this.add(new Sprite(headerImage, this.getCurrentSwatch()), 0);
	this.headerSprite.x = (graphics.width - headerImage.width) / 2;
	this.headerSprite.y = graphics.height - headerImage.height - 8;

	var font = graphics.getImage("font");
	var swatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

	var text = this.add(new Text(font, swatch), 0);
	text.value = "FINAL SCORE: " + this.score;
	text.x = (graphics.width - text.width) / 2;
	text.y = this.headerSprite.y - text.height - 16;

	if (game.isScoreHighscore(this.score))
	{
		this.changeState(State.EnterInitials);
		this.onEnterInitials(text.y);
	}
	else
	{
		this.changeState(State.WaitForContinue);
	}
}

EnterScoreStage.prototype.onUpdate = function()
{
	this.flashSwatches();

	if (this.isCurrentState(State.EnterInitials))
	{
		this.updateEnterInitials();
	}
	else if (this.isCurrentState(State.WaitForContinue))
	{
		if (controls.a.justPressed || controls.start.justPressed)
		{
			game.showHighscores();
		}
	}
}