class Circle {
  constructor(pPosX, pPosY, pRadius, pSpeed, pStartAngle) {
    this.posX = pPosX;
    this.posY = pPosY;
    this.radius = pRadius;
    this.speed = pSpeed;
    this.angle = pStartAngle ? pStartAngle : 0;
  }

  getX(){
    return this.radius * cos(this.angle) + this.posX;
  }

  getY(){
    return this.radius * sin(this.angle) + this.posY;
  }

  update(){
    this.angle += angleIncrement * this.speed;
  }
}

class Curve {
  constructor(pStrokeWeight) {
    this.strokeWeight = pStrokeWeight ? pStrokeWeight : curveStrokeWeight;

    // Initialize points array
    // Will contain multiples of [positionX, positionY]
    this.points = [];

    // Set first Color
    this.setColor();
  }

  setColor() {
    let red = 15//Math.floor(random() * 255);
    let green = 15//Math.floor(random() * 255);
    let blue = 15//Math.floor(random() * 255);
    let alpha = 150//Math.floor(random() * 255);

    this.color = color(red, blue, green, alpha);
  }

  addPoint(pPointX, pPointY) {
    this.points.push([pPointX, pPointY]);
  }

  draw() {
    stroke(this.color);
    strokeWeight(this.strokeWeight);
    noFill();

    beginShape();
    for (let i = 0; i < this.points.length; i++) {
      let point = this.points[i];
      vertex(point[0], point[1]);
    }
    endShape();
  }

  clear() {
    this.points = [];
  }
}

buildEverything = () => {
  // Build row of circles
  for (let i = 0; i < ammountRow; i++) {
    circleRow.push(new Circle(
      // Position x
      (circleRadius * 2 * (i+1)) - (3 * circleRadius),
      // Position Y
      circleRadius,
      // Radius
      circleRadius,
      // Speed
      speedFactor(i),
      // Starting-angle
      initialAngle
    ));
  }

  // Build collumn of circles
  for (let i = 0; i < ammountCol; i++) {
    circleCol.push(new Circle(
      // Position x
      circleRadius,
      // Position Y
      (circleRadius * 2 * (i+1)) - (3 * circleRadius),
      // Radius
      circleRadius,
      // Speed
      speedFactor(i),
      // Starting-angle
      initialAngle
    ));

    // Create array with [Columns]x[Rows]
    curves[i] = [];
    for (let j = 0; j < ammountRow; j++) {
      curves[i][j] = new Curve();
    }
  }
}

refreshAmmounts = () => {
  let supposedRows = Math.round(window.innerWidth  / (circleRadius * 2)) + 3;
  let supposedCols = Math.round(window.innerHeight / (circleRadius * 2)) + 3;

  if (ammountRow != supposedRows || ammountCol != supposedCols ) {
    ammountRow = supposedRows;
    ammountCol = supposedCols;

    circleCol = [];
    circleRow = [];
  }
}

clearAllCurves = () => {
  for (let i = 0; i < ammountCol; i++) {
    for (let j = 0; j < ammountRow; j++) {
      curves[i][j].clear();
    }
  }
}

let count = 0;
let msecsFirst = 0;
let msecsPrevious = 0;

function ResetCount() {
  count = 0;
}

function TapForBPM(e) {
  timeSeconds = new Date;
  msecs = timeSeconds.getTime();

  if ((msecs - msecsPrevious) > 2000) {
    count = 0;
  }

  if (count == 0) {
    msecsFirst = msecs;
    count = 1;
  } else {
    bpmAvg = 60000 * count / (msecs - msecsFirst);
    redrawTimeout = (1 / (Math.round(bpmAvg) / 60)) * 1000;

    clearInterval(redrawing);

    clearAllCurves();

    redrawing = setInterval(() => {
      clearAllCurves();
      refreshAmmounts();
      buildEverything();
    }, redrawTimeout);

    count++;
  }

  msecsPrevious = msecs;

  console.log(bpmAvg);

  return true;
}

let drawLines = false;
let speedFactor = i =>  0.65 * (i + 1);
// let speedFactor = i => log( 10 * (i + 1) );
// let speedFactor = i => Math.pow( 2, 2 * log(i + 1) );
let fps = 144;
let redrawTimeout = 1500;
let angleIncrement = 0.007;
let initialAngle = 0;
let curveStrokeWeight = 5;

let circleRadius = 50;

let ammountRow = 20;
let ammountCol = 12;

let circleRow = [];
let circleCol = [];
let curves = [];

function setup() {
  document.onkeypress = TapForBPM;
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fps);

  buildEverything();

  redrawing = setInterval(() => {
    clearAllCurves();
    refreshAmmounts();
    buildEverything();
  }, redrawTimeout);

}



function draw() {
  background(45);

  // Update every curve
  for (let i = 0; i < ammountCol; i++) {
    for (let j = 0; j < ammountRow; j++) {
      curves[i][j].addPoint(circleRow[j].getX(), circleCol[i].getY());
      curves[i][j].setColor();
      curves[i][j].draw();
    }
  }

  if ( drawLines ) {
    strokeWeight(1);
    for (let i = 0; i < ammountRow; i++) {
      line(circleRow[i].getX(), 0, circleRow[i].getX(), height);
    }
    for (let i = 0; i < ammountCol; i++){
      line(0, circleCol[i].getY(), width, circleCol[i].getY());
    }
  }

  // Update every circle (Not visible in graphics)
  for (let i = 0; i < ammountRow; i++) {
    circleRow[i].update();
  } for (let i = 0; i < ammountCol; i++) {
    circleCol[i].update();
  }

}
