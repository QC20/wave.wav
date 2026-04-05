let started = false;
let mic, fft;
let number = 150;
let array = [];

function setup() {
	let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	canvas.parent('canvas-container');
	strokeWeight(0.5);
	colorMode(HSB);

	document.getElementById('start-btn').addEventListener('click', startAudio);
}

function startAudio() {
	userStartAudio().then(() => {
		mic = new p5.AudioIn();
		mic.start(() => {
			fft = new p5.FFT();
			mic.connect(fft);
			started = true;

			let overlay = document.getElementById('overlay');
			overlay.classList.add('hidden');
		});
	}).catch((err) => {
		console.warn('Audio start failed:', err);
	});
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw() {
	background(10);

	if (!started) return;

	noFill();
	orbitControl();

	let spectrum = fft.analyze();
	array.push(spectrum);
	if (array.length > 60) {
		array.splice(0, 1);
	}

	translate(0, 100);
	rotateX(-0.4);

	for (let j = array.length - 1; j >= 0; j -= 3) {
		let item = array[j];
		for (let i = 0; i < number; i += 2) {
			let x = map(i, 0, number, -0.15, 0.15) * width;
			let w = (width * 0.5) / number;
			let h = item[i];
			let col = map(h, 0, 255, 0, 360);
			fill(col, 360, 360);
			push();
			translate(x, -h / 2, 200 + (w - 30) * ((array.length - j) / 3));
			box(w, h, w);
			pop();
		}
	}
}
