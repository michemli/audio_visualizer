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
let circleNum = 10;
let cols, rows,
    current = [],
    previous = [],
    damping = 0.9;
let colors = new Array();
let velocities = new Array();
let colorscale = new Array();
let circles = new Array();//data structure of circles and circles one frame before. when circle is too large we pop it out. 

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
    cols = width
    rows = height
    //pixelDensity(1.0)
    for (let i = 0; i < cols; i++) {
        current[i] = []
        previous[i] = []
        for (let j = 0; j < rows; j++) {
            current[i][j] = 255
            previous[i][j] = 255
        }
    }
    previous[100][100] = 255
    frameRate(18)
}

//splits array into parts. note this destroys the array :(
function splitToChunks(array, parts) {
    let result = [];
    for (let i = parts; i > 0; i--) {
        result.push(array.splice(0, Math.ceil(array.length / i)));
    }
    return result;
}

function mouseDragged() {
    current[mouseX][mouseY] = 0
}

function draw() {
    background(255);
   
    //Get the average (root mean square) amplitude
    let rms = analyzer.getLevel();
    let spectrum = fft.analyze();

    // Get average amplitude in specific frequency region
	/** const average = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
	var hue1 = average(spectrum.slice(spectrum.length/3));
	var hue2 = average(spectrum.slice(spectrum.length/3, 2*spectrum.length/3));
	var hue3 = average(spectrum.slice(2*spectrum.length/3, spectrum.length-1));
  
	fill(hue1*4, hue2*4, hue3*6, 150); **/
    // plots spectrum
    fill(255, 10);
    beginShape();
    for (l = 0; l < spectrum.length; l += 10) {

        vertex(l, map(spectrum[l], 0, 255, height, 0));
    }
    endShape();

    amp = Math.floor(6 * rms)
    amp2 = Math.floor(3 * rms)

    // split array into n parts, then finds the maximum intensity for each part, then draws an ellipse with size and color equal to the max intensity
    var spectrumChunks = splitToChunks(spectrum, circleNum);
    for (i = 0; i < spectrumChunks.length; i++) {
        spectrumChunks[i] = Math.max.apply(null, spectrumChunks[i])
        if (i % 3 == 0) { // yellow circles
            fill(spectrumChunks[i] * 1.5, spectrumChunks[i] * 1.5, 0, 10 * Math.log(spectrumChunks[i]));
            stroke(spectrumChunks[i] * 1.5, spectrumChunks[i] * 1.5, 0, 10 * Math.log(spectrumChunks[i]));
        }
        else if (i % 3 == 1) { // red circles
            fill(2 * spectrumChunks[i], 0, 0, 10 * Math.log(spectrumChunks[i]));
            stroke(spectrumChunks[i] * 1.5, spectrumChunks[i] * 1.5, 0, 10 * Math.log(spectrumChunks[i]));
        }
        else if (i % 3 == 2) { // orange circles
            fill(2 * spectrumChunks[i], 0.647 * spectrumChunks[i], 0, 10 * Math.log(spectrumChunks[i]));
            stroke(spectrumChunks[i] * 1.5, spectrumChunks[i] * 1.5, 0, 10 * Math.log(spectrumChunks[i]));
        }
        for (j = -amp; j < amp + 1; j++) {
            for (k = -amp2; k < amp2 + 1; k++) {
                ellipse(centerX + 150 * j, centerY + 150 * k, 20 + spectrumChunks[i] * (0.5 - i / 24), 20 + spectrumChunks[i] * (0.5 - i / 24));
                circles.push(20 + spectrumChunks[i] * (0.5 - i / 24))
                velocities.push(20 + i * (0.5 - i / 24)/500)
                colors.push(spectrumChunks[i])
                colorscale.push(1)
            }
        }

    }

    /**loadPixels()
    for (let i = 1; i < cols - 1; i++) {
        for (let j = 1; j < rows - 1; j++) {
            current[i][j] =
                (previous[i - 1][j] + previous[i + 1][j] +
                    previous[i][j - 1] + previous[i][j + 1] +
                    previous[i - 1][j - 1] + previous[i - 1][j + 1] +
                    previous[i + 1][j - 1] + previous[i + 1][j + 1]
                ) / 4 - current[i][j];
            current[i][j] = current[i][j] * damping
            let index = (i + j * cols) * 4;
            pixels[index + 0] = current[i][j] * 255
            pixels[index + 1] = current[i][j] * 255
            pixels[index + 2] = current[i][j] * 255
            pixels[index + 3] = 0
        }
    }
    updatePixels()**/
    
    for (q = circles.length-1; q>=0; q--) {
        for (r = -amp; r < amp + 1; r++) {
            for (s = -amp2; s < amp2 + 1; s++) {
                colorscale[q]*=0.75
                if (colors[q] % 3 == 0) { // yellow circles
                    fill(colors[q] * 1.5, colorscale[q] *colors[q] * 1.5, 0, colorscale[q]*10 * Math.log(colors[q]));
                    stroke(colors[q] * 1.5, colorscale[q] * colors[q] * 1.5, 0, colorscale[q] * 10 * Math.log(colors[q]));
                }
                else if (colors[q] % 3 == 1) { // red circles
                    fill(2 * colors[q], 0, 0, colorscale[q] * 10 * Math.log(colors[q]));
                    stroke(colors[q] * 1.5, colors[q] * 1.5, 0, colorscale[q] * 10 * Math.log(colors[q]));
                }
                else if (colors[q] % 3 == 2) { // orange circles
                    fill(2 * colors[q], 0.647 * colors[q], 0, colorscale[q] * 10 * Math.log(colors[q]));
                    stroke(colors[q] * 1.5, colors[q] * 1.5, 0, colorscale[q] * 10 * Math.log(colors[q]));
                }
                circles[q] = circles[q] + velocities[q]
                ellipse(centerX + 150 * r, centerY + 150 * s, circles[q] + velocities[q], circles[q] + velocities[q]);
                if (circles[q] >= 150) {
                    circles.splice(q)
                    velocities.splice(q)
                    colors.splice(q)
                    colorscale.splice(q)
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
    //centerX += 4 * (Math.random() - 0.5)
    //centerY += 4 * (Math.random() - 0.5)
    var temp = previous;
    previous = current;
    current = temp;
}