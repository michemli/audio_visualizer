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
var current = [[]];// = new float[cols][rows];
var previous = [[]];// = new float[cols][rows];
var dampening = 0.99;
let velocities = new Array(circleNum).fill(0);
let circles = new Array();//data structure of circles and circles one frame before. when circle is too large we pop it out. 
var soundFile;

var volhistory = [];

//function preload() {
//    song = loadSound('assets/lucky_dragons_-_power_melody.mp3');
//}

function setup() {
    background(255);
    let canvas = createCanvas(windowWidth, windowHeight);
    //song.loop();
    
    canvas.drop(gotFile); // listen for file drop onto canvas
    textAlign(CENTER);
    fill(0,0,90);
    text('Drop MP3 here', width / 2, height / 2);
    
    // create a new Amplitude analyzer
      analyzer = new p5.Amplitude();
  
      // Patch the input to an volume analyzer
      analyzer.setInput(soundFile);
  
      // makes new FFT analyzer. idk what these words mean
      fft = new p5.FFT();
      fft.setInput(soundFile);
  
      cols = width;
      rows = height;
      current = new Array(cols, rows);
      previous = new Array(cols, rows);
      
      angleMode(DEGREES);
      
      frameRate(60); // set framerate if you need it to be something other than the default 60fps
      

}

function gotFile(file) {
  if((!soundFile) && (file.type == "audio")) { // if don't already have sound && is audio
    soundFile = new p5.SoundFile(file); // create soundFile from dropped audio file
    initSound(); // init sound & FFT
    soundFile.loop();
  }
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
     if (soundFile) {
       background(0);
      
        
        //Get the average (root mean square) amplitude
        let rms = analyzer.getLevel();
        let spectrum = fft.analyze();
        
        var vol = analyzer.getLevel();
        volhistory.push(vol);
      
        // plots spectrum (currently doesnt work at the same time as plot ellipses)
        fill(255, 10);
        beginShape();
        for (l = 0; l < spectrum.length; l += 10) {
    
            vertex(l, map(spectrum[l], 0, 255, height, 0));
        }
        endShape();
    
        amp = Math.floor(4 * rms);
        amp2 = Math.floor(2 * rms);
    
        // split array into n parts, then finds the maximum intensity for each part, then draws an ellipse with size and color equal to the max intensity
        var spectrumChunks = splitToChunks(spectrum, circleNum);
        for (i = 0; i < spectrumChunks.length; i++) {
            spectrumChunks[i] = Math.max.apply(null, spectrumChunks[i]);
            if (i % 3 == 0) { // yellow circles
                fill(spectrumChunks[i] * 1.5, spectrumChunks[i] * 1.5, 0, 10 * Math.log(spectrumChunks[i]));
    
            }
            else if (i % 3 == 1) { // red circles
                fill(20 * spectrumChunks[i], 0, 0, 10 * Math.log(spectrumChunks[i]));
    
            }
            else if (i % 3 == 2) { // orange circles
                fill(2 * spectrumChunks[i], 2 * spectrumChunks[i], 0, 10 * Math.log(spectrumChunks[i]));
            }
                
            else if (i % 3 == 3) { // random
                fill(2 * spectrumChunks[i], random(255), 0, 10 * Math.log(spectrumChunks[i]));
    
            }
            for (j = -amp; j < amp + 1; j++) {
                for (k = -amp2; k < amp2 + 1; k++) {
                    noStroke();
                    ellipse(width/2 + 150 * j, height/2 + 150 * k, 20 + spectrumChunks[i] * (15 - i / 10), 20 + spectrumChunks[i] * (15 - i / 10));
                }
            }
    
        }
        
        //radial graph
        translate(width / 2, height / 2);
        stroke(255, 204, 0);
        beginShape();
        for (var i = 0; i < 360; i++) {
          var r = map(volhistory[i], 0, 1, 300, 700);
          var x = r * cos(i);
          var y = r * sin(i);
          vertex(x, y);
        }
        endShape();
      
        if (volhistory.length > 360) {
          volhistory.splice(0, 1);
        }
        var temp = previous;
        previous = current;
        current = temp;
       }
    
    
    
}

function initSound() { 
  fft = new p5.FFT(0.4,1024); // (smoothing, bins)
  soundFile.amp(0.7); 
}
