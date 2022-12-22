var main;

function setup() {
	let boundingRects = document
    .getElementById("p5Canvas")
    .getBoundingClientRect();
  let canvas = createCanvas(boundingRects.width, boundingRects.height);
  canvas.parent("p5Canvas");
	background(255);
	main = makeGrid(windowWidth, windowHeight, 20);
}

function draw() {
	background(255);
	fill(0);
	ellipse(mouseX, mouseY, 20, 20);
	textSize(20);
	
	// for (var i = 0; i < main.length; i++) {
	// 	main[i].draw(50);
	// }
	
	main.forEach(elem => {
		elem.update();
		elem.draw(50);
	});
}

function mouseDragged () {
	burst();
}

function mousePressed () {
	burst();
}

function burst () {
var mouse = new Posn(mouseX, mouseY);
	main.forEach(elem => {
		//elem.applyForce(elem.pos.offset(mouse).mul(0.00001).mul(elem.pos.dist(mouse) * 0.1));
		//elem.applyForce(elem.pos.offset(mouse).mul(0.01).mul(elem.pos.dist(mouse) * -0.01));
		elem.applyForce(elem.pos.offset(mouse).mul(pow(2, -(elem.pos.dist(mouse) * 0.04))));
	});
}

function makeGrid (width, height, blockSize) {
	var arr = [];
	
	for (var i = blockSize; i < width; i += blockSize) {
		for (var j = blockSize; j < height; j += blockSize) {
			arr.push(new Point(i, j, Math.random().toString(20)[3]));
			//arr.push(new Point(i, j, "a"));
		}
	}
	
	return arr;
}

function Point (x, y, letter, mass) {
	this.supposed = new Posn(x, y);
	this.pos = new Posn(x, y);
	this.vel = new Posn(0, 0);
	this.acc = new Posn(0, 0);
	this.lettering = letter != null;
	this.letter = letter;
	this.mass = mass == null ? 1 : mass;
	
	this.draw = (size) => {
		if (this.lettering) {
			text(this.letter, this.pos.x, this.pos.y);
		} else {
			ellipse(this.pos.x, this.pos.y, size, size);
		}
	};
	
	this.update = () => { // should draw, update position, tell if clicked, etc, etc,
		this.applyForce(new Posn(random(-0.01, 0.01), random(-0.01, 0.01)));
		this.seek(this.supposed);
		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.vel.mul(0.95); // friction
		this.acc.mul(0); //clear acc
	};
	
	this.seek = (target) => {
		this.applyForce(this.pos.offset(target).mul(this.pos.dist(target)).mul(-0.0001));
	};
	
	this.applyForce = (force) => {
		this.acc.add(force);
	}
	
	this.click = (mousePos) => { // click (posn) -> void
		
	};
}

function Posn (x, y) {
	this.x = x;
	this.y = y;
	
	this.get = () => {
		return new Posn(this.x, this.y);
	};
	
	this.apply = (f) => {
		this.x = f(this.x);
		this.y = f(this.y);
		
		return new Posn(this.x, this.y);
	}
	
	this.add = (other) => {
		this.x += other.x;
		this.y += other.y;
		
		return this.get();
	};
	
	this.mul = (c) => {
		this.x *= c;
		this.y *= c;
		
		return this.get();
	}
	
	this.offset = (other) => {
		return new Posn(this.x - other.x, this.y - other.y);
	}
	
	this.dist = (other) => {
		return sqrt(sq(other.x - this.x) + sq(other.y - this.y));
	}
}