function ParticleSystem()
{
	this.particles = [];
	
	this.addParticle = function(particle)
	{
		this.particles.push(particle);
	}
	
	this.update = function()
	{
		for (var i = this.particles.length - 1; i >=0; --i)
		{
			if (this.particles[i].life <= 0)
			{
				this.particles.splice(i, 1);
			}
		}
	}
	
	this.draw = function()
	{
		noStroke();
		for (var i = 0; i < this.particles.length; ++i)
		{
			this.particles[i].update();
			this.particles[i].draw();
		}
	}
}

function Particle(pos, vel, life, r)
{
	this.pos = pos.copy();
	this.vel = vel.copy();
	this.life = life;
	this.maxlife = life;
	
	this.update = function()
	{
		this.pos.add(this.vel);
		this.life = this.life - 1;
	}
	
	this.draw = function(i)
	{
		fill(map(this.life, 0, this.maxlife, 100, 255));
		ellipse(this.pos.x, this.pos.y, r, r);
	}
}