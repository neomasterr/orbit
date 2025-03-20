function Ship(pos, particlesystem)
{
	Entity.apply(this, arguments);
	
	this.angle = HALF_PI;
	
	this.w = 10;	// width
	this.h = 15;	// height
	this.fuel = {value: 150, maxvalue: 300, fueling: 0, maxfueling: 0.25, height: 300, width: 20, cost: {rotate: 0.1, throttle: 0.5, idle: 0.05}}; // fuel
	this.lastfuel = 0;
	this.engine = {thrust: 0.05, rotate: 0.001, rpm: 0, rpmmax: 100, rpmadd: 1, rpmsub: 1};	// engine power
	this.trail = [];
	this.counter = 0;
	this.particlesystem = particlesystem;
	
	this.planetsbeside = 0;	
	this.visited = [];
	
	Ship.prototype.draw = function()
	{
		for (var i = 0; i < this.trail.length - 1; ++i)
		{
			stroke(map(i, 0, this.trail.length, 0, 255));
			line(this.trail[i].x, this.trail[i].y, this.trail[i + 1].x, this.trail[i + 1].y);
		}
		
		push();
		
		stroke(255);
		translate(this.pos.x, this.pos.y);
		rotate(this.angle);
		fill(0);
		triangle(-this.w, this.h, 0, -this.h, this.w, this.h);
		
		resetMatrix();
		stroke(100, 100, 200);
		fill(0);
		rect(15, height / 2, this.fuel.width, this.fuel.height);
		var x = this.fuel.height * this.fuel.value / this.fuel.maxvalue;
		var off = this.fuel.height - x;
		noStroke();
		
		var r = map(this.fuel.value, 0, 1, 255, 0);
		var g = map(this.fuel.value, 0, 1, 0, 255);
		var b = 0;
		fill(r, g, b);
		rect(15, height / 2 + off / 2, this.fuel.width, x);
		
		if (this.lastfuel > 0)
		{
			fill(0, 200, 0);
			var yoff = height / 2 + 7.5;
			text('+' + this.lastfuel.toFixed(4), 30, yoff - map(this.lastfuel, 0, this.fuel.maxfueling, 0, this.fuel.height / 2));
			this.lastfuel = 0;
		}
		else
		{
			fill(200, 0, 0);
			var yoff = height / 2 + 7.5;
			text(this.lastfuel.toFixed(4), 30, yoff + map(this.lastfuel, 0, -1, 0, this.fuel.height / 2));
			this.lastfuel = 0;
		}
		
		pop();
	}
	
	this.hello = function(x)
	{
		if (this.visited.indexOf(x) == -1) this.visited.push(x);
		this.planetsbeside++;
	}
	
	this.bye = function()
	{
		this.planetsbeside--;
	}
	
	this.fueling = function(value)
	{
		var x = min(this.fuel.maxfueling, value);
		this.fuel.fueling = this.fuel.fueling + x;
		this.lastfuel += x;
	}
	
	Ship.prototype.update = function()
	{		
		Entity.prototype.update.apply(this);
		
		if (keyIsDown(LEFT_ARROW))
		{
			if (this.fuel.value > this.fuel.cost.rotate)
			{
				this.rot -= this.engine.rotate;
				this.fueling(-this.fuel.cost.rotate);
			}
		} else if (keyIsDown(RIGHT_ARROW))
		{
			if (this.fuel.value > this.fuel.cost.rotate)
			{
				this.rot += this.engine.rotate;
				this.fueling(-this.fuel.cost.rotate);
			}
		}
		
		var m = millis();
		
		if (keyIsDown(UP_ARROW))
		{
			if (this.fuel.value > this.fuel.cost.throttle)
			{
				var v = p5.Vector.fromAngle(this.angle - HALF_PI);
				
				this.engine.rpm = min(this.engine.rpm + this.engine.rpmadd, this.engine.rpmmax);
				this.engine.throttle = this.engine.rpm / this.engine.rpmmax;
			
				v.mult(this.engine.thrust * this.engine.throttle);
				this.applyForce(v);
				this.fueling(-this.fuel.cost.throttle * this.engine.throttle);
				
				if (this.particlesystem)
				{
					for (var i = 0; i < max(3, 10 * this.engine.throttle); i++)
					{
						var p = createVector(0, this.h / 2).rotate(this.angle).add(this.pos);
						var v = createVector(random(-3, 3), random(10, 30) + abs(this.vel.y)).rotate(this.angle);
						
						var particle = new Particle(p, v, random(10, 30), i * 2.7);
						this.particlesystem.addParticle(particle);
					}
				}
			}
		}
		else
		{
			this.engine.rpm = max(this.engine.rpm - this.engine.rpmadd, 0);
			this.engine.throttle = this.engine.rpm / this.engine.rpmmax;
			
			if (keyIsDown(DOWN_ARROW))
			{
				this.vel = createVector();
			}
		}		
		
		if (this.planetsbeside == 0) this.fueling(-this.fuel.cost.idle);		
		
		this.fuel.value = max(0, min(this.fuel.maxvalue, this.fuel.value + this.fuel.fueling));
		this.fuel.fueling = 0;
	
		if (this.counter++ % 4 == 0)
		{
			this.trail.push({x: this.pos.x, y: this.pos.y});
		}
		
		if (this.trail.length > 120) this.trail.splice(0, 1);
	}
}