'use strict';

// ── constants ────────────────────────────────────────────────────────────────

const COLS        = 64;     // frequency columns rendered
const HISTORY_MAX = 52;     // frames of spectral history kept
const LAYER_STEP  = 13;     // z-distance between history layers (px)
const MAX_BAR_H   = 0.44;   // max bar height as fraction of canvas height

// ── state ────────────────────────────────────────────────────────────────────

let mic, fft;
let history = [];
let started = false;

// ── setup ────────────────────────────────────────────────────────────────────

function setup() {
	let cnv = createCanvas(windowWidth, windowHeight, WEBGL);
	cnv.parent('canvas-container');
	colorMode(HSB, 360, 100, 100);
	noStroke();

	document.getElementById('start-btn').addEventListener('click', onStartClick);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// ── audio init ───────────────────────────────────────────────────────────────

function onStartClick() {
	userStartAudio()
		.then(() => {
			mic = new p5.AudioIn();
			mic.start(() => {
				fft = new p5.FFT(0.85, 1024);
				mic.connect(fft);
				started = true;
				document.getElementById('overlay').classList.add('hidden');
				document.getElementById('hud').classList.add('visible');
			});
		})
		.catch(err => console.warn('Audio error:', err));
}

// ── idle waveform (ambient animation before mic starts) ──────────────────────

function idleSpectrum() {
	let t = frameCount * 0.013;
	return Array.from({ length: 512 }, (_, i) => {
		let f = i / 512;
		let w =
			sin(t * 1.2  + f * 20) * 0.42 +
			sin(t * 0.55 + f * 8)  * 0.36 +
			sin(t * 0.22 + f * 3.5) * 0.22;
		let envelope = exp(-f * 5.0); // roll off above low-mid freqs
		return max(0, (w * 0.5 + 0.5) * envelope * 105);
	});
}

// ── draw ─────────────────────────────────────────────────────────────────────

function draw() {
	// Very dark cool blue-black
	background(222, 28, 5);

	// Lights ─ key from upper-left, soft fill from lower-right
	ambientLight(18, 20, 32);
	directionalLight(200, 225, 255, -0.55, -1.0, -0.45);
	directionalLight( 65,  52,  95,  0.65,  0.55,  0.7);

	orbitControl(1.2, 1.2, 0.05);

	// Build this frame's spectrum
	let spectrum = started ? fft.analyze() : idleSpectrum();
	history.push(spectrum);
	if (history.length > HISTORY_MAX) history.shift();

	// Scene placement: tilt slightly, center the depth tunnel
	translate(0, height * 0.08);
	rotateX(-0.36);

	let totalW    = width * 0.64;
	let colSlot   = totalW / COLS;
	let boxW      = colSlot * 0.74;
	let halfDepth = (history.length - 1) * LAYER_STEP * 0.5;

	// Render layers back → front so newer bars draw on top
	for (let j = 0; j < history.length; j++) {
		let frame     = history[j];
		let ageFactor = j / max(history.length - 1, 1);   // 0 = oldest, 1 = newest
		let ageCurve  = pow(ageFactor, 0.5);               // slower fade for recent layers
		let z         = j * LAYER_STEP - halfDepth;

		for (let i = 0; i < COLS; i++) {
			// Focus on the perceptually meaningful lower portion of the spectrum
			let bin  = floor(map(i, 0, COLS, 0, frame.length * 0.5));
			let amp  = frame[bin];
			let ampN = constrain(amp / 255, 0, 1);

			let barH = map(amp, 0, 255, 1, height * MAX_BAR_H);
			if (barH < 2) continue;

			let x = map(i, 0, COLS - 1, -totalW * 0.5, totalW * 0.5);

			// Thermal palette: deep indigo → electric cyan → near-white
			let hue = lerp(238, 178, ampN);
			let sat = lerp(92,  18,  ampN);
			let bri = lerp(24,  96,  ampN) * ageCurve;

			// Crystal material: colored diffuse + white-cyan specular glint
			ambientMaterial(hue, sat, bri);
			specularMaterial(185, 22, 100);
			shininess(60);

			push();
			translate(x, -barH * 0.5, z);
			box(boxW, barH, boxW);
			pop();
		}
	}
}
