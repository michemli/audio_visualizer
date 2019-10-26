

let cols, rows,
    current = [],
    previous = [],
    damping = 0.9;

function mouseDragged() {
    current[mouseX][mouseY] = 255
}

function setup() {
    pixelDensity(1)
    createCanvas(600, 400)
    cols = width
    rows = height
    for (let i = 0; i < cols; i++) {
        current[i] = []
        previous[i] = []
        for (let j = 0; j < rows; j++) {
            current[i][j] = 0
            previous[i][j] = 0
        }
    }
    previous[100][100] = 255
}

function draw() {
    background(0)
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
            let index = (i + j * cols)*4;
            pixels[index + 0] = current[i][j] * 255
            pixels[index + 1] = current[i][j] * 255
            pixels[index + 2] = current[i][j] * 255
            pixels[index + 3] = 255
        }
    }
    updatePixels()**/

    loadPixels()
    for (let i = 1; i < cols - 1; i++) {
        for (let j = 1; j < rows - 1; j++) {
            current[i][j] =
                (previous[i - 1][j] + previous[i + 1][j] +
                    previous[i][j - 1] + previous[i][j + 1]
                    //+previous[i - 1][j - 1] + previous[i - 1][j + 1] +
                    //previous[i + 1][j - 1] + previous[i + 1][j + 1]
                ) / 2 - current[i][j];
            current[i][j] = current[i][j] * damping
            let index = (i + j * cols) * 4;
            pixels[index] = current[i][j] * 255
            pixels[index + 1] = current[i][j] * 255
            pixels[index + 2] = current[i][j] * 255
            //pixels[index + 3] = 255
        }
    }
    updatePixels()

    //swap buffers
    let temp = previous
    previous = current
    current = temp
}





