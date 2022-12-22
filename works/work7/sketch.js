let size, tile, grid, rotations;
let changed = -1;

function setup() {
  let boundingRects = document
    .getElementById("p5Canvas")
    .getBoundingClientRect();
  let canvas = createCanvas(boundingRects.width, boundingRects.height);
  canvas.parent("p5Canvas");
	size = min(width, height) / 10;
	
	tile = createGraphics(size, size);
	tile.background(0);
	tile.fill(255);
	tile.ellipse(size, size, size*0.7, size*0.7);
	tile.ellipse(size, -size, size*2.7, size*2.7);
	tile.ellipse(-size, size, size*2.7, size*2.7);
	
	grid = [];
	rotations = [];
	let counterY = 0;
	for(let y = size/2; y < height; y += size){
		let counterX = 0;
		for(let x = size/2; x < width; x += size){
			let rotation = counterX++ % 2 == 0 ? HALF_PI : 0;
			if(counterY % 2 == 1)
				rotation += counterX % 2 == 0 ? -HALF_PI : HALF_PI;
			rotations.push(rotation);
			grid.push({rotation, x, y});
		}
		counterY++;
	}
}

function draw() {
	background(255);
	grid.forEach((g, index) => {
		g.rotation += (rotations[index] - g.rotation) * 0.09; 
		push();
			translate(g.x, g.y);
			rotate(g.rotation);
			image(tile, - size / 2, - size / 2);
		pop();
	});
}

function findClosest(){
	let closest = 0;
	let closestDistance = 9999;
	grid.forEach((g, index) => {
		let d = dist(mouseX, mouseY, g.x, g.y);
		if(d < closestDistance) {
			closestDistance = d;
			closest = index;
		}
	});
	return closest;
}

function mousePressed() {
	changed = findClosest();
	rotations[changed] += HALF_PI;
}

function mouseMoved() {
	let tempChanged = findClosest();
	if(changed != tempChanged){
		changed = tempChanged;
		rotations[changed] += HALF_PI;
	}
}