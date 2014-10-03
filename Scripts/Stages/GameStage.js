//! require "BaseStage.js"

GameStage = function(demo)
{
	State =
	{
		PreInit : 0,
		NewBall : 1,
		Serving : 2,
		Playing : 3,
		LostBall : 4,
		NextLifeWait : 5,
		GameOver : 5
	}

	this.ball = null;
	this.paddle = null;
	this.blocks = null;
	
	this.score;
	this.combo;
	this.lives;

	this.curState;

	this.scoreText;
	this.livesText;

	this.lastParticle = 0;

	this.setScore = function(score)
	{
		this.score = score;
		this.scoreText.value = "SCORE " + this.score;
	}

	this.addScore = function(score)
	{
		this.setScore(this.score + score);
	}

	this.setLives = function(lives)
	{
		this.lives = lives;
		this.livesText.value = this.lives + " LIVES";
		this.livesText.x = graphics.width - this.livesText.width - 4;
	}

	this.onEnter = function()
	{
		graphics.setClearColor(13);

		this.ball = this.add(new Ball(), 1);
		this.paddle = this.add(new Paddle(), 0);
		this.blocks = this.add(new BlockGrid(12, 8), 0);

		this.ball.x = 32;
		this.ball.y = 32;

		this.paddle.x = graphics.width / 2;
		this.paddle.y = 8;

		this.blocks.x = 4;
		this.blocks.y = graphics.height - 68 - 12;

		var font = graphics.getImage("font");
		var white = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

		this.scoreText = this.add(new Text(font, white), 1);
		this.scoreText.x = 4;
		this.scoreText.y = graphics.height - 12;

		this.livesText = this.add(new Text(font, white, 0));
		this.livesText.y = graphics.height - 12;

		curState = State.PreInit;

		this.setScore(0);
		this.setLives(3);

		for (var y = 0; y < this.blocks.getRows(); ++y)
		{
			for (var x = 0; x < this.blocks.getColumns(); ++x)
			{
				if ((x + (y / 2) * 3 + 1) % 6 <= 1) continue;

				this.blocks.setGrid(x, y, 1 + (y % this.blocks.getPhases()));
			}
		}
	}

	this.particleSpam = function()
	{
		if (game.time - this.lastParticle > 1.0 / 30.0)
		{
			if (this.ball.isVisible)
			{
				this.addParticle(this.ball.position,
								 new Vector2f(Math.random() * 16.0 - 8.0, Math.random() * 16.0 - 8.0),
								 Math.random() * 0.25 + 0.25);
			}


			this.lastParticle = game.time;
		}
	}
}

GameStage.prototype = new BaseStage();

GameStage.prototype.onUpdate = function()
{
	this.particleSpam();

	if (this.paddle)
	{
		this.paddle.getNextX();
	}

	BaseStage.prototype.onUpdate.call(this);
}