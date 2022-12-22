let field;
let arrow;
let resolution = 30;
let hu = 160;


class FlowField {
	constructor() {
		this.field = []
		for (let i = 0; i < width / resolution; i++) {
			this.field.push([]);
			for (let j = 0; j < height / resolution; j++) {
				this.field[i].push(atan2(
					height * 0.1 - (2 * j + 1) * resolution * 0.8,
					width * 0.1 - (2 * i + 1) * resolution * 0.8
				))
			}
		}
	}
	update() {
		for (let i = 0; i < width / resolution; i++) {
			for (let j = 0; j < height / resolution; j++) {
				this.field[i][j] = atan2(
					mouseY - (2 * j + 1) * resolution * 0.8,
					mouseX - (2 * i + 1) * resolution * 0.8
				)
			}
		}
	}
	display() {
		for (let i = 0; i < this.field.length; i++) {
			for (let j = 0; j < this.field[i].length; j++) {
				push()
				translate((2 * i + 1) * resolution * 0.8, (2 * j + 1) * resolution * 0.8)
				rotate(this.field[i][j])
				image(arrow, 0, 0)
				pop()
			}
		}
	}
}

function setup() {
  let boundingRects = document
    .getElementById("p5Canvas")
    .getBoundingClientRect();
  let canvas = createCanvas(boundingRects.width, boundingRects.height);
  canvas.parent("p5Canvas");
  background (60);
	imageMode(CENTER)
}

	
function draw() {
	arrow = createGraphics(resolution, resolution)
	arrow.colorMode(HSB);
	arrow.stroke(hu%360,80,100);
	arrow.strokeWeight(2);
	arrow.beginShape(LINES)
	arrow.vertex(0, 0.5 * resolution)
	arrow.vertex(resolution, 0.5 * resolution)
	arrow.vertex(resolution, 0.5 * resolution)
	arrow.vertex(0.5 * resolution, 0.8 * resolution)
	arrow.vertex(resolution, 0.5 * resolution)
	arrow.vertex(0.5 * resolution, 0.2 * resolution)
	arrow.endShape()
	field = new FlowField()

	background (60);
	field.update()
	field.display()
	hu++;
}