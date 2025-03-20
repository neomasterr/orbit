function GUISystem()
{
    this.components = [];

    this.addChild = function(component)
    {
        this.components.push(component);
        return component;
    }

    this.update = function()
    {
        for (var i = 0; i < this.components.length; ++i)
        {
            this.components[i].update();
        }
    }

    this.draw = function()
    {
        resetMatrix();
        for (var i = 0; i < this.components.length; ++i)
        {
            this.components[i].draw();
        }
    }
}

function GUIPanel(pos, size, col)
{
    GUIComponent.apply(this, [pos, size]);
    this.col = col;
}

GUIPanel.prototype = Object.create(GUIComponent.prototype);
GUIPanel.prototype.constructor = GUIPanel;
GUIPanel.prototype.draw = function()
{
    fill(this.col);
    rect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    GUIComponent.prototype.draw.apply(this);
}

function GUIComponent(pos, size)
{
    this.pos = pos;
    this.size = size;
    this.displayed = true;
    this.components = [];

    this.addChild = function(component)
    {
        this.components.push(component);
        return component;
    }
}

GUIComponent.prototype.update = function()
{
    for (var i = 0; i < this.components.length; ++i)
    {
        if (this.components[i].displayed == true) this.components[i].update();
    }
}

GUIComponent.prototype.draw = function()
{
    for (var i = 0; i < this.components.length; ++i)
    {
        if (this.components[i].displayed == true) this.components[i].draw();
    }
}
