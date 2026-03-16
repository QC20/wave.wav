# wave.wav

An interactive real-time 3D audio visualization that transforms your microphone input into an evolving landscape of color and motion. Each frequency band from your voice or sound becomes a three-dimensional column that grows and shrinks in response to the acoustic energy detected in that range. The longer you engage with it, the deeper the temporal history becomes visible as layers stack behind your current sound.

## What it does

wave.wav uses Fast Fourier Transform (FFT) to decompose incoming audio into its frequency components in real time. Rather than showing a flat representation, this visualization positions each frequency band as a discrete 3D box in space, creating a sculptural representation of sound that evolves continuously. The height of each box corresponds to the amplitude of that frequency, while the color shifts smoothly across the HSB spectrum based on frequency content. Lower frequencies appear as warm tones while higher frequencies render in cooler hues.

What makes this approach interesting is how the data persists. The visualization maintains a rolling history of the last 60 frames worth of spectral data, displaying them as layered depth across the Z-axis. This creates a temporal dimension where you can see the recent history of your sound compressed into space. It functions somewhat like a seismograph for audio, where the movement and color represent the acoustic micro-moments that just occurred.

The interaction model is deliberately simple. You can rotate the view using your mouse or trackpad to examine the shape from different angles. There are no buttons to press or parameters to tweak. The visualization responds naturally to whatever sound reaches the microphone, whether that's speech, music, ambient noise, or silence.

## Customization possibilities

The visualization can be adapted in several ways that would change its character entirely. You could adjust the number of frequency bins analyzed (currently 150), which would either compress the spectrum into fewer, thicker bars or expand it into finer detail. You could change how the temporal layers stack, making them spread out rather than overlap, which would feel more like analyzing a recording than experiencing a live continuous wave. The color mapping could shift from frequency-based HSB to volume-based intensity, which would give you a different perceptual channel. You could also swap the microphone input for audio file playback, line-in audio, or even synthesized signals, each bringing different material and visual character to the visualization.

## Running locally

You'll need a web server to run this project due to browser security restrictions around local file access. The simplest approach is to use Python's built-in server. Navigate to the project directory and run:

```
python3 -m http.server 8000
```

Then open your browser to `http://localhost:8000`. When the page loads, your browser will ask for microphone permission. The visualization will start responding to any sound it picks up.

Note that microphone access is only available over HTTPS in production environments or localhost in development, so testing locally works smoothly but deployment will require HTTPS setup.

To get started, clone this repository with `git clone https://github.com/QC20/wave.wav.git` and follow the steps above.