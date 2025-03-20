function Entity(pos)
{
    this.pos = pos;
    this.vel = createVector();
    this.acc = createVector();
    this.angle = 0;
    this.rot = 0;

    Entity.prototype.draw = function()
    {

    }

    this.applyForce = function(force)
    {
        this.acc.add(force);
    }

    Entity.prototype.update = function()
    {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

        this.angle += this.rot;
    }
}
