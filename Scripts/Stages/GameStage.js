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
		this.changeState(State.PreInit);

		graphics.setClearColor(13);

		this.ball = this.add(new Ball(), 1);
		this.paddle = this.add(new Paddle(), 0);
		this.blocks = this.add(new BlockGrid(12, 8), 0);

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

		this.setScore(0);
		this.setLives(3);

		this.combo = 0;

		for (var y = 0; y < this.blocks.getRows(); ++y)
		{
			for (var x = 0; x < this.blocks.getColumns(); ++x)
			{
				if ((x + (y / 2) * 3 + 1) % 6 <= 1) continue;

				this.blocks.setGrid(x, y, 1 + (y % this.blocks.getPhases()));
			}
		}

		this.ball.velocity = Vector2f.ZERO;
		this.ball.x = this.paddle.getNextX();
		this.ball.y = this.paddle.y + 8;

		this.changeState(State.Serving);
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

	this.changeState = function(nextState)
	{
		this.curState = nextState;
	}

	this.onBlockHit = function()
	{
		this.addScore(++this.combo);
	}

	this.onPaddleHit = function()
	{
		this.combo = 0;
	}

	this.updateServingState = function()
	{
		this.ball.x = this.paddle.getNextX();

		if (controls.a.justPressed)
		{
			this.changeState(State.Playing);

			this.ball.velocity = new Vector2f(this.paddle.nextX > this.paddle.x ? 1.0 : -1.0, 1.5).mul(96.0);
		}
	}

	this.updatePlayingState = function()
	{

	}

	this.isCurrentState = function(state)
	{
		return this.curState == state;
	}
}

GameStage.prototype = new BaseStage();

GameStage.prototype.onUpdate = function()
{
	this.particleSpam();

	if (this.isCurrentState(State.Serving))
	{
		this.updateServingState();
	}
	else if (this.isCurrentState(State.Playing))
	{
		this.updatePlayingState();
	}

	BaseStage.prototype.onUpdate.call(this);
}