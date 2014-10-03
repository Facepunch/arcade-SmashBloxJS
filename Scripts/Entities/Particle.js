Particle = function(position, velocity, lifetime)
{
	this.position = position;
	this.velocity = velocity;
	this.lifetime = lifetime;
	
	this.shouldRemove = function() { return this.lifetime <= 0.0; }

	this.update = function(dt)
	{
		this.position = this.position.add(this.velocity.mul(dt));
		this.lifetime -= dt;
	}
}