function setup() {
	createCanvas(windowWidth * 0.7, windowHeight * 0.7, WEBGL);
	strokeWeight(.5);
	background(255);
	colorMode(HSB)

	// Getting microphone input
	mic = new p5.AudioIn();
	mic.start();

	// This allows us to generate a spectrum, and use the microphone as input
	fft = new p5.FFT();
	mic.connect(fft);

	number = 150;
	array = [];
}

function draw() {
	background(255);
	noFill()
	orbitControl();
	spectrum = fft.analyze()
	if(frameCount % 1 == 0){array.push(spectrum)}
	translate(0, 100)
	rotateX(-0.4)
	//noStroke()
	if (array.length > 60) {
		array = array.splice(1)
	}
	for (let j = array.length-1; j >= 0; j-=3) {
		item = array[j]
		for (let i = 0; i < number; i+=2) {
			// option = random([0, 1]) ? stroke(0) : noStroke()
			x = map(i, 0, number, -0.15, 0.15) * width
			y = 0
			w = (width * 0.5) / number
			h = item[i]
			col = map(h, 0, 255, 0, 360)
			fill(col, 360, 360)
			push()
			translate(x, y - h / 2, 200+(w-30)*((array.length-j)/3))
			box(w, h, w)
			pop()
		}
	}
}