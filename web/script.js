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

var fontScale = 64 / 2520;
var circleFontScale = 48 / 2520;
var innerCircleScale = 80 / 2520;
var outerCircleScale = 100 / 2520;
var iconScale = 0.2 / 2520;
var headerHeightScale = 0.07 / 2520;

var pipelineIdx = -1;
var pressCounts = [1, 4, 7, 7, 20, 0];
var messages = [
    "Press Space To Begin",
    "Tap Spacebar Along The Beat",
    "Great, Now We'll See How Well You Maintain The Beat On Your Own!",
    "The Beat Is Now Going To Fade...",
    "Keep Going!",
    "Thank You For Playing, Your Score Has Been Recorded!"
];
var pressTime = [];

var pressCount = 0;
var message = "";

let canvasWidth = document.documentElement.clientWidth;
let canvasHeight = document.documentElement.clientHeight;

var beatTimer = 0;
var randomShapeTimer = 0;

var beatVolume = 1;

var bpm = 30;
var mspb = 60 * 1000 / bpm;

var userName = "";

function preload() {
    logo = loadImage("web/assets/logo.png");
    volUpIcon = loadImage("web/assets/vol_up.png");
    beat = loadSound("web/assets/beat.mp3");
    robotoFont = loadFont("web/assets/roboto.ttf");
}

function setup() {
    createCanvas(canvasWidth, canvasHeight);
    frameRate(60);

    fetchBPM();

    runPipeline();
}
  
function draw() {
    background("#282828");
    
    renderShapes();
    renderMessage();
    renderCounter();

    if (pipelineIdx == 5) {
        addShapesTimely(300);
    }

    renderHeader();
    renderBeatAudio();
}

function addShapesTimely(delay) {
    if (millis() >= delay + randomShapeTimer) {
        addShape();
        randomShapeTimer = millis();
    }
}

function renderBeatAudio() {
    if (pipelineIdx > 0 && pipelineIdx < 5) {
        if (millis() >= beatTimer) {
            beat.play();
            beatTimer = millis() + mspb;

            if (pipelineIdx == 4) {
                beat.setVolume(0, 0.8);
            }
        }
    }
}

// Renders Application Header
function renderHeader() {
    strokeWeight(0);
    fill("#181818");
    rect(0, 0, width, headerHeightScale * width * height);

    logoHeight = headerHeightScale * width * height;
    logoWidth = logoHeight/logo.height * logo.width;

    image(logo, 0.5 * width - logoWidth / 2, (headerHeightScale * width / 2) * height - logoHeight/2, logoWidth, logoHeight);
}

// Renders and Cleans Shape List
function renderShapes() {
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

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

function renderMessage() {
    fill(255, 255, 255);
    textAlign(CENTER, CENTER);
    textSize(width * fontScale);
    textFont(robotoFont);
    text(message, 0.5 * width, 0.5 * height);

    if (pipelineIdx == 1) {
        volUpIconWidth = volUpIcon.width * iconScale * width;
        volUpIconHeight = volUpIcon.height * iconScale * width;
        image(volUpIcon, 0.5 * width - volUpIconWidth / 2, 0.4 * height - volUpIconHeight / 2, volUpIconWidth, volUpIconHeight);
    }
}

function inputName() {
    userName = prompt("Input Your Name");
    if (userName.trim().length > 0) {
        return true;
    }
    else {
        alert("ERROR: Invalid Name Entered");
        return false;
    }
}

function renderCounter() {
    if ((pipelineIdx == 3 || pipelineIdx == 4) && pressCount >= 0 && pressCount < 5) {
        noFill();
        stroke(255, 255, 255);
        strokeWeight(3);
        circle(0.5 * width, 0.4 * height, innerCircleScale * width);
        circle(0.5 * width, 0.4 * height, outerCircleScale * width);

        strokeWeight(2);
        fill(255, 255, 255);
        textFont(robotoFont);
        textAlign(CENTER, CENTER);
        textSize(width * circleFontScale);
        text(pressCount + 1, 0.5 * width, 0.395 * height);
    }
}

function keyPressed() {
    if (key == " ") {
        runPipeline();
    }
}

function computeResult() {
    var result = [];
    for (var i = 2; i < pressTime.length; i++) {
        result.push(pressTime[i] - (pressTime[i - 1] + mspb));
    }
    return result;
}

function uploadResult() {
    var result = computeResult();
    var data = "name=" + userName + "&data=" + JSON.stringify(result) + "&raw=" + JSON.stringify(pressTime);
    var url = "/saveResult";
    postRequest(url, data, function() {
        console.log("Result uploaded to server!");
        console.log(result);
    });
}

function runPipeline() {
    if (pipelineIdx < 5) {
        if (pipelineIdx > 0) {
            addShape();
            pressTime.push(millis());
        }

        if (pipelineIdx != 0 || (pipelineIdx == 0 && inputName())) {
            if (pressCount == 0) {
                pipelineIdx++;
                pressCount = pressCounts[pipelineIdx];
                message = messages[pipelineIdx];
            }
            pressCount--;
        }

        if (pipelineIdx == 5) {
            uploadResult();
        }
    }
}

function addShape() {
    shapes.push(
        new BeatShape(
            randFloat(0.1, 0.9),    // X
            randFloat(0.1, 0.9),    // Y
            randInt(100, 300),      // Radius
            randInt(3, 10),         // Vertices
            [                       // Fill Color
                randInt(0, 255), 
                randInt(0, 255), 
                randInt(0, 255)
            ], 
            randInt(200, 300),      // Rotation Speed
            randInt(0, 1)           // Rotation Direction
        )
    );
}

function removeShape(idx) {
    shapes.splice(idx, 1);
}

function polygon(shape) {
    push();

    translate(shape.x, shape.y);
    rotate(frameCount / shape.rotSpeed);
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

function fetchBPM() {
    getRequest("/getBPM", function(data) {
        bpm = parseInt(data);
        mspb = 60 * 1000 / bpm;
    });
}

function getRequest(url, callback)
{
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText);
    }
    request.open("GET", url, true);
    request.send(null);
}

function postRequest(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() { 
        if (request.readyState == 4 && request.status == 200)
            callback(request.responseText);
    }
    request.open("POST", url, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    request.send(data);
}