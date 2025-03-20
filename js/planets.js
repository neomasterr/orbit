function Planet(pos, r, g, i)
{
	Entity.apply(this, arguments);
	this.r = r;
	this.g = g;
	this.i = i;
	this.crashed = false;
	this.force = 0;
	this.fill = 0;
	if (i == const_planets - 1) this.fill = 255;
	
	this.gravitymult = 5;
	this.gravityradius = this.r * this.gravitymult;
	this.gravitydist = this.gravityradius / 2;
	this.fueldist = {min: this.r * 2, max: this.gravityradius, optimal: this.gravitydist / 2};
	this.fuelby = {min: 0.05, max: 0.4, steepness: this.gravitymult * 2};
	
	Planet.prototype.draw = function()
	{
		push();
		
		noFill();
		stroke(0, 255, 0, 10);
		strokeWeight(this.fueldist.optimal / this.fuelby.steepness * 2);
		ellipse(this.pos.x, this.pos.y, this.fueldist.optimal * 2, this.fueldist.optimal * 2);		
		strokeWeight(1);
		
		stroke(255);
		fill(this.fill);
		ellipse(this.pos.x, this.pos.y, this.r, this.r);
		
		fill(255);
		textAlign(CENTER);
		text(this.g.toFixed(2), this.pos.x, this.pos.y);
		
		stroke(30, 30, 30);
		noFill();
		ellipse(this.pos.x, this.pos.y, this.gravityradius, this.gravityradius);
		pop();
	}
	
	this.doGravity = function(ship)
	{
		var v = this.pos.copy();
		v.sub(ship.pos);
		v.normalize();
		
		var d = dist(this.pos.x, this.pos.y, ship.pos.x, ship.pos.y);
		
		var force = max(0, this.g - map(d, 0, this.gravitydist, 0, this.g));
		
		if (force > 0)
		{
			if (this.force == 0) ship.hello(this.i);
			var fuelby = map(constrain(1 / (abs(d - this.fueldist.optimal) / this.fuelby.steepness), 0, 1), 0, 1, this.fuelby.min, this.fuelby.max);
			
			ship.fueling(fuelby);
			if (d * 2 < this.r)
			{
				this.crashed = true;
			}
		}
		else if (this.force !== 0) ship.bye();
		this.force = force;
		v.mult(force);
		ship.applyForce(v);		
	}
}