// Square Moving Around Screen
// September 19, 2024


let x = 0;
let y = 0;
let squareSize = 50;
let speed = 50;
let state = "right";

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  moveSquare();
  displaySquare();
}

function moveSquare() {
  if (state === "right") {
    x += speed;
    if (x >= width - squareSize) {
      state = "down";
    }
  }
  else if (state === "down") {
    y += speed;
    if (y >= height - squareSize) {
      state = "left";
    }
  }
  else if (state === "left") {
    x -= speed;
    if (x <= 0) {
      state = "up";
    }
  }
  else if (state === "up") {
    y -= speed;
    if (y <= 0) {
      state = "right";
    }
  }
}

function displaySquare() {
  fill(random(0, 255), random(255), random(255));
  square(x, y, squareSize);
}

