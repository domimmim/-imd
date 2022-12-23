let blobs = [];
let i = 0;

const Blob = function () {
    stroke(0, 10);

    let xoff = random(10000); // start at diff. noise positions
    let yoff = random(10000);
    const speed = random(0.0005); // perlin
    const lerpAmt = random(0.025, 0.05); // lerp
    let sortedView = false;

    let d = 10;
    let x = noise(xoff) * width;
    let y = noise(yoff) * height;
    let sortedX = 0;
    let sortedY = 0;

    if (random(100) < 5) {
        d = random(60)
    } else {
        d = random(10);
    }

    let mouseMatch = function () {
        return dist(mouseX, mouseY, x, y) > (d / 2);
    }

    return {
        update: function () {
            xoff += speed;
            yoff += speed;
            if (!sortedView) {
                x = lerp(x, noise(xoff) * width, lerpAmt);
                y = lerp(y, noise(yoff) * height, lerpAmt);
            } else {
                x = lerp(x, sortedX, lerpAmt);
                y = lerp(y, sortedY, lerpAmt);
            }
        },
        display: function () {
            colorMode(RGB);
            let colX = map(x, 0, width, 0, 400);
            let colY = map(y, 0, height, 0, 200);

            if (mouseMatch()) {
                fill(colX, colY, 255, 200);
            }
            else {
                fill(255, 200);
            }

            ellipse(x, y, d);
        },
        sort: function (pos) {
            sortedView = !sortedView;
            sortedX = pos.x;
            sortedY = pos.y;
        },
        mouseMatch, d
    }
}

function gradient(
    col1 = [240, 65, 30],
    col2 = [340, 65, 50],
    resolution = 64
) {
    colorMode(HSL);
    for (let y = 0; y < height; y += height / resolution) {
        noStroke();

        let lerpAmt = map(y, 0, height, 0, 1);
        let h = lerp(col1[0], col2[0], lerpAmt);
        let s = lerp(col1[1], col2[1], lerpAmt);
        let l = lerp(col1[2], col2[2], lerpAmt);

        fill(h,s,l);
        rect(0, y, width, 1+height/resolution);
    }
}

function setup() {
  let boundingRects = document
    .getElementById("p5Canvas")
    .getBoundingClientRect();
  let canvas = createCanvas(boundingRects.width, boundingRects.height);
  canvas.parent("p5Canvas");

	for (each of Array(300)) {
		blobs.push(Blob());
	}
}

function draw() {
	background(50);
	gradient();

	for (const blob of blobs) {
		blob.update();
		blob.display();
	}
}

function mousePressed() {
	sortBySize();
}

function sortBySize() {
	const sizes = blobs.map(b => b.d);
	const sorted = [...sizes].sort((a, b) => a - b);
	const sortedIndexes = sorted.map(el => sizes.indexOf(el));

	const xy = [];

	for (let y = 0; y < height; y += width / sqrt(blobs.length)) {
		for (let x = 20; x < width; x += height / sqrt(blobs.length)) {
			xy.push({ x, y });
		}
	}

	for (const [i, b] of sortedIndexes.entries()) {
		blobs[b].sort(xy[i]);
	}
}
