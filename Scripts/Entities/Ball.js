Ball = function()
{
	this.sprite = null;
	this.paddleHit = null;
	this.blockHit = null;
	this.velocity = new GameAPI.Vector2f(0, 0);
	this.alive = false;
}

Ball.prototype.onUpdate = function()
{
	if (this.alive)
	{
		this.position = this.position.add(this.velocity.mul(this.stage.timestep));

		this.updateCollision();
	}
}

Ball.prototype.onLoadAudio = function()
{
	this.paddleHit = audio.getSound("bounce2");
	this.blockHit = audio.getSound("bounce");
}

Ball.prototype.onLoadGraphics = function()
{
	var img = graphics.getImage("ball");
	var swatch = graphics.palette.findSwatch(0xffffff, 0xffffff, 0xffffff);

	this.sprite = this.add(new GameAPI.BudgetBoy.Sprite(img, swatch), new GameAPI.Vector2i(-2, -2));

	this.calculateBounds();
}

Ball.prototype.bounce = function(normal, scale)
{
	var dot = this.velocity.dot(normal);

	if (dot >= 0) return;

	this.velocity = this.velocity.sub(normal.mul(dot).mul(1 + scale));
}

Ball.prototype.updateCollision = function()
{
	if (this.x < 8.0)
	{
		this.x = 8.0;
		this.bounce(GameAPI.Vector2f.UNIT_X, 1.0);
		audio.play(this.paddleHit, this.panValue, 1.0, 1.0);
	}
	else if (this.x > graphics.width - 8.0)
	{
		this.x = graphics.width - 8.0;
		this.bounce(new GameAPI.Vector2f(-1, 0), 1.0);
		audio.play(this.paddleHit, this.panValue, 1.0, 1.0);
	}

	if (this.y > graphics.height - 20.0)
	{
		this.y = graphics.height - 20.0;
		this.bounce(new GameAPI.Vector2f(0, -1.0), 1.0);
		audio.play(this.paddleHit, this.panValue, 1.0, 1.0);
	}

	if (this.bounds.intersects(this.stage.paddle.bounds))
	{
		this.bounce(GameAPI.Vector2f.UNIT_Y, 1.0);

		this.stage.onPaddleHit();

		audio.play(this.paddleHit, this.panValue, 1.0, 1.0);
	}

	var collisionResult = this.stage.blocks.checkForCollision(this);

	if (collisionResult.hit)
	{
		if (collisionResult.normal.x > 0)
		{
			this.bounce(GameAPI.Vector2f.UNIT_X, 1.0);
		}
		else if (collisionResult.normal.x < 0)
		{
			this.bounce(new GameAPI.Vector2f(-1, 0), 1.0);
		}

		if (collisionResult.normal.y > 0)
		{
			this.bounce(GameAPI.Vector2f.UNIT_Y, 1.0);
		}
		else if (collisionResult.normal.y < 0)
		{
			this.bounce(new GameAPI.Vector2f(0, -1), 1.0);
		}

		audio.play(this.blockHit, this.panValue, 1.0, 1.0 - Math.log(collisionResult.phase, 10) / 2.0);
	}
}