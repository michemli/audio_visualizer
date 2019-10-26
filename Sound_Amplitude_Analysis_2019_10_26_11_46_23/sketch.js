/**
 * @name Measuring Amplitude
 * @description <p>Analyze the amplitude of sound with
 * p5.Amplitude.</p>
 *
 *  <p><b>Amplitude</b> is the magnitude of vibration. Sound is vibration,
 *  so its amplitude is is closely related to volume / loudness.</p>
 *
 * <p>The <code>getLevel()</code> method takes an array
 * of amplitude values collected over a small period of time (1024 samples).
 * Then it returns the <b>Root Mean Square (RMS)</b> of these values.</p>
 *
 * <p>The original amplitude values for digital audio are between -1.0 and 1.0.
 * But the RMS will always be positive, because it is squared.
 * And, rather than use instantanous amplitude readings that are sampled at a rate
 * of 44,100 times per second, the RMS is an average over time (1024 samples, in this case),
 * which better represents how we hear amplitude.
 * </p>
 * <p><em><span class="small"> To run this example locally, you will need the
 * <a href="http://p5js.org/reference/#/libraries/p5.sound">p5.sound library</a>
 * a sound file, and a running <a href="https://github.com/processing/p5.js/wiki/Local-server">local server</a>.</span></em></p>
 */
let song, analyzer;
let centerX = 710 / 2, centerY = 500 / 2;


function preload() {
	song = loadSound('assets/lucky_dragons_-_power_melody.mp3');
}

function setup() {
	createCanvas(710, 500);
	song.loop();

	// create a new Amplitude analyzer
	analyzer = new p5.Amplitude();

	// Patch the input to an volume analyzer
	analyzer.setInput(song);

	// makes new FFT analyzer. idk what these words mean
	fft = new p5.FFT();
	fft.setInput(song);

}

//splits array into parts. note this destroys the array :(
function splitToChunks(array, parts) {
	let result = [];
	for (let i = parts; i > 0; i--) {
		result.push(array.splice(0, Math.ceil(array.length / i)));
	}
	return result;
}


function draw() {
	background(255);
	stroke(0);
	//Get the average (root mean square) amplitude
	let rms = analyzer.getLevel();
	let spectrum = fft.analyze();

	// Get average amplitude in specific frequency region
	/** const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
	var hue1 = average(spectrum.slice(spectrum.length/3));
	var hue2 = average(spectrum.slice(spectrum.length/3, 2*spectrum.length/3));
	var hue3 = average(spectrum.slice(2*spectrum.length/3, spectrum.length-1));
  
	fill(hue1*4, hue2*4, hue3*6, 150); **/
	// plots spectrum (currently doesnt work at the same time as plot ellipses)
	fill(255, 10);
	beginShape();
	for (l = 0; l < spectrum.length; l += 10) {

		vertex(l, map(spectrum[l], 0, 255, height, 0));
	}
	endShape();


	// split array into n parts, then finds the maximum intensity for each part, then draws an ellipse with size and color equal to the max intensity
	var spectrumChunks = splitToChunks(spectrum, 10);
	for (i = 0; i < spectrumChunks.length; i++) {
		spectrumChunks[i] = Math.max.apply(null, spectrumChunks[i])
		if (i % 3 == 0) {
			fill(spectrumChunks[i] * 5, 0, 0, 20);
			for (j = -3; j < 4; j++) {
				for (k = -2; k < 3; k++) {
					ellipse(centerX + 100 * j, centerY + 100 * k, 40 + spectrumChunks[i] * (0.5 - i / 24), 40 + spectrumChunks[i] * (0.5 - i / 24));
				}
			}
		}
		else if (i % 3 == 1) {
			fill(0, spectrumChunks[i] * 5, 0, 20);
			for (j = -3; j < 4; j++) {
				for (k = -2; k < 3; k++) {
					ellipse(centerX + 100 * j, centerY + 100 * k, 40 + spectrumChunks[i] * (0.5 - i / 24), 40 + spectrumChunks[i] * (0.5 - i / 24));
				}
			}
		}
		else if (i % 3 == 2) {
			fill(0, 0, spectrumChunks[i] * 5, 20);
			for (j = -3; j < 4; j++) {
				for (k = -2; k < 3; k++) {
					ellipse(centerX + 100 * j, centerY + 100 * k, 40 + spectrumChunks[i] * (0.5 - i / 24), 40 + spectrumChunks[i] * (0.5 - i / 24));
				}
			}
		}


	}


	// Draws an ellipse with size based on amplitude of specified frequency
	// fill(0, hue2*4, 0, 50); 
	// ellipse(q, j, 100 + hue2*2, 100+hue2*3);
	// fill(0, 0, hue3*6, 50);
	// ellipse(q, j, 100 + hue3*1.6, 100+hue3*1.6);

	// drifts center of ellipse a lil bit
	centerX += 4 * (Math.random() - 0.5)
	centerY += 4 * (Math.random() - 0.5)

}
