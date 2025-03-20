// CORE
var const_planets = 30;

// GAME
var player;
var win_at;
var stars = [];
var planets = new Array(const_planets);
var particles;
var GUI;
// STATS
var crashes = 0;

// WINDOW
var w = 1600;
var h = 800;
var scl = 1.0;

// SYSTEM
var zoom = 1.0;
var zMin = 0.1;
var zMax = 1.0;
var sens = 0.001;

var counter = 0;



function setup()
{
	w = windowWidth * scl;
	h = windowHeight * scl;
	createCanvas(w, h);
	rectMode(CENTER);
	
	for (var i = 0; i < planets.length; ++i)
	{
		var r = random(70, 140);
		planets[i] = new Planet(createVector( i * r * 10, height / 2 + i * r * random(-1, 1)), r, random(0.1, 0.05), i);
	}
	
	stars = [];
	
	for (var i = 0; i < 1000; ++i)
	{
		stars.push({x: random(1, w), y: random(1, h), n: map(noise(i), 0, 1, 0, 255)});
	}
	
	particles = new ParticleSystem();
	GUI = new GUISystem();
	
	// GUI.addChild(new GUIPanel(createVector(10, 10), {width: 100, height: 100}, color(255, 100, 50)));	
	// GUI.components[0].addChild(new GUIPanel(createVector(50, 50), {width: 10, height: 10}, color(100, 255, 50)));
	
	game_init();
}

function game_init()
{	
	player = new Ship(createVector(-w / 3, h / 2), particles);
	
	for (var i = 0; i < planets.length; ++i)
	{
		planets[i].crashed = false;
		planets[i].force = 0;
	}
}

function draw()
{
	background(0);
	
	text(frameRate().toFixed(2), width - 50, 20);
	stroke(255, 100, 50);
	line(0, 0, w, 0);
	line(w - 1, 0, w - 1, h);
	line(0, h - 1, w, h - 1);
	line(0, 0, 0, h);
	
	for (var i = 0; i < stars.length; ++i)
	{
		stroke(stars[i].n - map(noise(player.pos.x, player.pos.y, i), 0, 1, 130, 0));
		point(stars[i].x, stars[i].y);
	}
	scale(zoom);
	translate(-player.pos.x + w / 2, -player.pos.y + h / 2);
	
	
	noFill();
	strokeWeight(1);
	stroke(255);
	
	noFill();
	for (var i = 0; i < planets.length; ++i)
	{
		planets[i].draw();
		planets[i].doGravity(player);
		if (planets[i].crashed)
		{
			if (i == planets.length - 1)
			{
				if (!win_at) win_at = (millis() / 1000).toFixed(2);
				textAlign(CENTER);
				text('YOU WIN', planets[i].pos.x, planets[i].pos.y);
				text('(' + win_at + 's)', planets[i].pos.x, planets[i].pos.y + 15);
			}
			else
			{
				crashes++;
				game_init();
				return;
			}
		}
	}
	
	player.update();	
	player.draw();	
	
	particles.update();
	particles.draw();
	
	resetMatrix();
	fill(0, 255, 0);
	text('Time: ' + (millis() / 1000).toFixed(2) + 's', 100, 15);
	text('Planets visited: ' + player.visited.length, 100, 30);
	text('Crashes: ' + crashes, 100, 45);
	
	GUI.update();
	GUI.draw();
}

function mouseWheel(event)
{
  zoom += sens * -event.delta;
  zoom = constrain(zoom, zMin, zMax);
  return false;
}