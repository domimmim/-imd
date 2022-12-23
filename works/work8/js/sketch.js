
const MAX_NUMBER = 280;


let vertShader = `
	precision highp float;

	attribute vec3 aPosition;

	void main() {
		vec4 positionVec4 = vec4(aPosition, 1.0);
		positionVec4.xy = positionVec4.xy * 2.0 - 1.0;
		gl_Position = positionVec4;
	}
`;

let fragShader = `
	precision highp float;
	
	uniform float time;
	uniform float a;
	uniform float slide;
	uniform vec2 resolution;
	uniform vec3 particles[${MAX_NUMBER}];
    uniform vec3 colors[${MAX_NUMBER}];

	
	void main() {
			vec2 st = gl_FragCoord.xy / resolution.xy; 
			
            // Center coordinates;
            vec2 st_c = 1.0 - 2.0 * st;
			
            // Restore aspect ratio;
			st_c.y *= resolution.y/resolution.x;


			float angle = a * 2.0 * 5.1415;
			mat2 R = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
			st_c *= R;

			float mult = 0.01;
			
      vec3 col = vec3(0.0);
        
			for(int i = 0; i < ${MAX_NUMBER}; i++){
			
					vec3 particle = particles[i];
					vec2 pos = particle.xy;
					float m = particle.z * 0.8;
					vec3 color = colors[i]/ 255.0;
					col += color / distance(st_c, pos)  * m * mult ;
			}
           
			vec3 output_color = col;
			vec3 contr = output_color * output_color;
			output_color = mix(output_color, contr, slide);
			gl_FragColor = vec4(output_color, 1.0);
			
	}
`;

let shader;
let buffer, bufferB;
let palette = ["#FFAD21", "#00DD96", "#A23251", "#C946FF", "#005CAA"];
let particles = [];
let colors = [];
let angle = 1.0;
let target_angle = 0.5;


let time = 0.0;
let speed = 1.009;
let w;

function preload() {
	shader = new p5.Shader(this.renderer, vertShader, fragShader);
}

function setup() {
	let boundingRects = document
    .getElementById("p5Canvas")
    .getBoundingClientRect();
  let canvas = createCanvas(boundingRects.width, boundingRects.height);
  canvas.parent("p5Canvas");
	background(0);
	w = min(1200, 800);
  pixelDensity(1);
	
	buffer = createGraphics(w, w, WEBGL);
	bufferB = createGraphics(w, w);
	buffer.noStroke();

	for (let i = 0; i < MAX_NUMBER; i++){
		let p = [random(-0.2, 0.2), random(-0.2, 0.4), random(0.04, 0.3)];
		particles.push(p);

		let col = palette[int(random(0, 5))];
		colors.push([red(col), green(col), blue(col)]);
	}

	
}

function draw() {
	
	if ((random(0.0, 1.0) < 0.01) & (abs(angle - target_angle) < 0.01)){
		target_angle = random(0.0, 1.0);
	  }
	  
	angle += (target_angle - angle) * 0.001;
	
	let data = prepareData(particles, colors);

	shader.setUniform("a", angle);
	shader.setUniform("slide", 0.9);
	shader.setUniform("resolution", [w, w]);
	shader.setUniform("particles", data.particles);
	shader.setUniform("colors", data.colors);

	buffer.shader(shader);
	buffer.rect(0, 0, w, w);
	
	bufferB.image(buffer, 0, 0, w, w);
	
	
	
	image(bufferB, (width - w) * 0.5, (height - w) * 0.5, w, w);

	// Motion effect;

	for (let i  = 0; i < particles.length; i++){
		let sp = speed * (1.0 + 0.02 * particles[i][2]);
		let p = [particles[i][0] * sp, particles[i][1] * sp, particles[i][2] * sp];
		particles[i] = p;
	}

	// Check boundaries;

	particles.forEach((p, i) => {

		let x = p[0];
		let y = p[1];

		if (x > 1.0 | x < - 1.0 | y > 1.0 | y < -1.0){
			p[2] *= 0.8;
		}
		if (x > 2.0 | x < - 2.0 | y > 2.0 | y < -2.0){
			p[0] = random(-0.5, 0.3);
			p[1] = random(-0.3, 0.3);
			p[2] = random(0.01, 0.4);
			let col = palette[int(random(0, 5))];
			colors[i] = [red(col), green(col), blue(col)];
		}
	});

	time += 0.05;
}



function prepareData(arr, arr2){
	
	let data = {"particles": [], "colors" : []}
	arr.forEach((p, i) => {
		data["particles"].push(...p);
		data["colors"].push(...arr2[i]);
	});
	return data;
}




