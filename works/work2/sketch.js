var FRAME_ALPHA = 5; 
var SPAWN_MIN_X = 0; 
var SPAWN_MAX_X = 0; 
var MAX_X_SPEED = 0.5; 
var MAX_X_ACCEL = 0.025; 
var MAX_Y_SPEED = 9.5; 
var GRAVITY = 0.0575; 
var FRICTION = 0.9995; 
var MIN_RAD = 3; 
var MAX_RAD = 6; 
var MIN_RG = 64; 
var MAX_RG = 255; 
var EXPLODE_RAD = 250; 
var EXPLODE_STR = 5; 

var drops = [];

function setup() {
  let boundingRects = document
    .getElementById("p5Canvas")
    .getBoundingClientRect();
  let canvas = createCanvas(boundingRects.width, boundingRects.height);
  canvas.parent("p5Canvas");
	colorMode(RGB, 255, 255, 255, 100);
	ellipseMode(RADIUS);
	noStroke();
	background(0);
	frameRate(240);
	SPAWN_MAX_X = width
}
function draw() {
	background(0, 0, 0, FRAME_ALPHA);
	drops.push(new drop()); 
	
	
	for (var i = drops.length - 1; i >= 0; i--) {
		drops[i].Run();

		if (!drops[i].isAlive()) {
			drops.splice(i, 1);
		}
	}
}


function drop() {
	this.x = random(SPAWN_MIN_X, SPAWN_MAX_X);
	this.y = 0; 
	this.rad = random(MIN_RAD, MAX_RAD); 
	this.xSpeed = 0; 
	this.ySpeed = 0; 
	this.rg = random(MIN_RG, MAX_RG); 
	this.b = 255; 
	
	this.Run = function() {
		this.Update();
		this.Display();
	};
	
	
	this.Update = function() {
		
		this.ySpeed += GRAVITY;
		var a = random(-MAX_X_ACCEL, MAX_X_ACCEL);
		this.xSpeed += a;
		
		this.xSpeed *= FRICTION;
		this.ySpeed *= FRICTION;
		this.y += this.ySpeed;
		this.x += this.xSpeed;
	};
	
	this.Display = function() {
		fill(this.rg, this.rg, this.b, 100);
		ellipse(this.x, this.y, this.rad, this.rad);
	};
	
	this.isAlive = function() {
		return this.y < height; 
	};
}

function mouseClicked() {
	for (var i = 0; i < drops.length; i++) {
		var dist = sqrt(sq(drops[i].x - mouseX) + sq(drops[i].y - mouseY));
		if (dist > EXPLODE_RAD) { continue; }
		var v = createVector(drops[i].x - mouseX, drops[i].y - mouseY);
		var str = EXPLODE_STR * (EXPLODE_RAD - dist) / EXPLODE_RAD;
		v.normalize();
		v.mult(str);
		drops[i].xSpeed += v.x;
		drops[i].ySpeed += v.y;
	}
}