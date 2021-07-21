let canvasWidth = document.documentElement.clientWidth;
let canvasHeight = document.documentElement.clientHeight;

class BeatShape {
    constructor(x, y, radius, npoints, fillColor, rotSpeed, rotClockwise) {
        this.x = width * x;
        this.y = height * y;
        this.radius = radius;
        this.npoints = npoints;
        this.fillColor = fillColor;
        this.rotSpeed = rotSpeed;
        this.rotClockwise = rotClockwise;

        this.alpha = 0;

        if (!this.rotClockwise) {
            this.rotSpeed *= -1;
        }
    }
}

var shapes = [];

function setup() {
    createCanvas(canvasWidth, canvasHeight);
}
  
function draw() {
    background("#001f3f");

    for (var idx = 0; idx < shapes.length; idx++) {
        if (shapes[idx].radius <= 0) {
            removeShape(idx);
        }
        else {
            polygon(shapes[idx]);
            shapes[idx].radius -= 3;
            shapes[idx].alpha += 10;
        }
    }
}

function keyPressed() {
    if (key == " ") {
        addShape();
    }
}

function addShape() {
    shapes.push(
        new BeatShape(
            randFloat(0, 1),    // X
            randFloat(0, 1),    // Y
            randInt(100, 300),   // Radius
            randInt(3, 10),     // Vertices
            [                   // Fill Color
                randInt(0, 255), 
                randInt(0, 255), 
                randInt(0, 255)
            ], 
            randInt(10, 40),    // Rotation Speed
            randInt(0, 1)       // Rotation Direction
        )
    );
}

function removeShape(idx) {
    shapes.splice(idx, 1);
}

function polygon(shape) {
    push();

    translate(shape.x, shape.y);
    //rotate(frameCount / shape.rotSpeed);
    strokeWeight(0);
    fill(shape.fillColor[0], shape.fillColor[1], shape.fillColor[2], shape.alpha);

    let angle = TWO_PI / shape.npoints;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = cos(a) * shape.radius;
        let sy = sin(a) * shape.radius;
        vertex(sx, sy);
    }
    endShape(CLOSE);

    pop();
}

function randInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randFloat(min, max) {
    return Math.random() * (max - min) + min;
}