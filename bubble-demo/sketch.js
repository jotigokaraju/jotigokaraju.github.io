// Bubble Object Demo
// Removing Objects from an Array

let theBubbles = []; 
let time = 0;
function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 5; i++) {
    spawnBubbles();
  }
}


function draw() {
  background(220);

  moveBubblesRandomly(time);

  time += 0.01;
}

function spawnBubbles() {
  let bubble = {
    x: random(width),
    y: height + random(0, 25),
    speed: random(2, 5),
    radius: random(20, 40),
    mover: random(25, 100),
  };

  theBubbles.push(bubble);
}

function moveBubblesRandomly(time) {
  
  for (let bubble of theBubbles) {
    let x = noise(bubble.timeX) * width;
    let y = noise(bubble.timeY) * height;
    bubble.x = x;
    bubble.y = y;

    bubble.timeX += bubble.deltaTime;
    bubble.timeY += bubble.deltaTime;


  }
}

function displayBubbles() {
  for (let bubble of theBubbles) {
    circle(bubble.x, bubble.y, bubble.radius*2);
  }
}