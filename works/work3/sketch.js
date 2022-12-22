const PALETTE = ["#ACDEED55", "#EAD5E855", "#84C0E755", "#38439955"];
const NOISE_SCALE = 0.01;

let particles = [];

function setup() {
  let boundingRects = document
    .getElementById("p5Canvas")
    .getBoundingClientRect();
  let canvas = createCanvas(boundingRects.width, boundingRects.height);
  canvas.parent("p5Canvas");
	background("#F5F4FD");
	noStroke();
}

function draw() {
	if (mouseIsPressed) {
		particles.push(new Particle(mouseX, mouseY));
	}
	
	for (let i = particles.length - 1; i >= 0; i--) {
		particles[i].draw();
		particles[i].update();
		if (particles[i].remove()) {
			particles.splice(i, 1);
		}
	}
}

class Particle {
	constructor(x, y) {
		this.velocity = createVector(0, 0);
		this.position = createVector(x, y);
		this.diameter = random([10, 30]);
		this.decayRate = this.diameter * random(0.002, 0.025);
		this.zOffset = random(0, 2)
		this.color = color(random(PALETTE));
	}
	
	update() {
		let theta = map(noise(NOISE_SCALE * this.position.x, NOISE_SCALE * this.position.y, NOISE_SCALE * this.zOffset), 0, 1, -TAU, TAU);
		this.velocity.x = cos(theta);
		this.velocity.y = sin(theta);
		this.position.add(this.velocity);
		this.diameter -= this.decayRate;
	}
	
	draw() {
		fill(this.color);
		circle(this.position.x, this.position.y, this.diameter);
	}
	
	remove() {
		return this.diameter <= 0;
	}
}