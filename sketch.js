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
    this.strokeWeight = pStrokeWeight ? pStrokeWeight : 20;
    this.points = [];
  }

  setColour() {
    // this.colourHex = rand;
    // this.colourAlpha = pColourAlpha;
    this.colour = color(Math.floor(random()*255), Math.floor(random()*255), Math.floor(random()*255));
  }

  addPoint(pPointX, pPointY) {
    this.points.push([pPointX, pPointY]);
  }

  draw() {
    stroke(this.colour);
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

let fps = 144;
let redrawTimeout = 546;
let angleIncrement = 0.01;
let circleRadius = 50;
let ammountRow = 20;
let ammountCol = 12;
let circleRow = [];
let circleCol = [];
let curves = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(fps);

  for (let i = 0; i < ammountRow; i++) {
    // Build Row
    circleRow.push(new Circle(circleRadius * 2 * (i+1) - 3 * circleRadius, circleRadius, circleRadius, (i+1), 0));
  }

  for (let i = 0; i < ammountCol; i++) {
    // Build Col
    circleCol.push(new Circle(circleRadius, circleRadius * 2 * (i+1) - 3 * circleRadius, circleRadius, (i+1), 0));

    curves[i] = [];
    for (let j = 0; j < ammountRow; j++) {
      curves[i][j] = new Curve();
    }
  }

  setInterval(() => {
    for (let i = 0; i < ammountCol; i++) {
      for (let j = 0; j < ammountRow; j++) {
        curves[i][j].clear();
      }
    }
    if (ammountRow != Math.round(window.innerWidth / (circleRadius * 2)) + 3 || ammountCol != Math.round(window.innerHeight / (circleRadius * 2)) + 3) {
      ammountRow = Math.round(window.innerWidth / (circleRadius * 2)) + 3;
      ammountCol = Math.round(window.innerHeight / (circleRadius * 2)) + 3;
      circleCol = [];
      circleRow = [];

      for (let i = 0; i < ammountRow; i++) {
        // Build Row
        circleRow.push(new Circle(circleRadius * 2 * (i+1) - 3 * circleRadius, circleRadius, circleRadius, (i+1), 0));
      }

      for (let i = 0; i < ammountCol; i++) {
        // Build Col
        circleCol.push(new Circle(circleRadius, circleRadius * 2 * (i+1) - 3 * circleRadius, circleRadius, (i+1), 0));

        curves[i] = [];
        for (let j = 0; j < ammountRow; j++) {
          curves[i][j] = new Curve();
        }
      }
    }
  }, redrawTimeout);

}



function draw() {
  background(45);

  for (let i = 0; i < ammountCol; i++) {
    for (let j = 0; j < ammountRow; j++) {
      curves[i][j].addPoint(circleRow[j].getX(), circleCol[i].getY());
      curves[i][j].setColour();
      curves[i][j].draw();
    }
  }

  // for (let i = 0; i < ammount; i++) {
  //   line(circleRow[i].getX(), 0, circleRow[i].getX(), height);
  //   line(0, circleCol[i].getY(), width, circleCol[i].getY());
  //
  //   circleCol[i].draw();
  //   circleRow[i].draw();
  // }

  for (let i = 0; i < ammountRow; i++) {
    circleRow[i].update();
  } for (let i = 0; i < ammountCol; i++) {
    circleCol[i].update();
  }

}
