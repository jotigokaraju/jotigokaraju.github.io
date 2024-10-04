// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let redC = 0;
let blueC = 0;
let greenC = 0;

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  spawnBall(random(windowWidth), random(windowHeight));

  for (let ball of ballArray) {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x > width-ball.radius || ball.x < 0 + ball.radius) {
      ball.dx *= -1;
    }

    if (ball.y > height-ball.radius || ball.y < 0 + ball.radius) {
      ball.dy *= -1;
    }

    fill(ball.red, ball.blue, ball.green);
    circle(ball.x, ball.y, ball.radius*2);

  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function spawnBall(xVal, yVal) {
  if (redC < 254) {
    redC++;
  }

  else if (redC > 254) {

    if (blueC < 254) {
      blueC++;
    }

    if (blueC > 254) {
      greenC++;
    }
  }
  
  let ball = {
    x: xVal,
    y: yVal,
    radius: random(30, 60),
    dx: random(-5, 5),
    dy: random(-5, 5),
    red: redC,
    blue: blueC,
    green: greenC,
  };

  



  ballArray.push(ball);

}