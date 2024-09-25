// Traffic Light Starter Code
// Your Name Here
// The Date Here

// GOAL: make a 'traffic light' simulator. For now, just have the light
// changing according to time. You may want to investigate the millis()
// function at https://p5js.org/reference/#/p5/millis

let a = "white";
let b = "white";
let c = "white";
let lastTimeSwitched = 0;
const waitTime = 2000;
function setup() {
  createCanvas(100, 300);
}

function draw() {
  background(255);
  drawOutlineOfLights();
}

function drawOutlineOfLights() {
  //box
  rectMode(CENTER);
  fill(0);
  rect(width / 2, height / 2, 75, 200, 10);

  determine_colour();
  //lights
  fill(a)
  ellipse(width / 2, height / 2 - 65, 50, 50); //top

  fill(b)
  ellipse(width / 2, height / 2, 50, 50); //middle

  fill(c)
  ellipse(width / 2, height / 2 + 65, 50, 50); //bottom
}

function determine_colour() {
  if (millis() > lastTimeSwitched + waitTime + 800) {
    lastTimeSwitched = millis();
    a = "red";
    b = "light yellow";
    c = "white";
  }
  else if ((millis() > lastTimeSwitched + waitTime + 500) && (millis() < lastTimeSwitched + waitTime + 700)) {
    
    a = "light red";
    b = "yellow";
    c = "white";
  }
  else if ((millis() > lastTimeSwitched + waitTime)  && (millis() < lastTimeSwitched + waitTime + 500)) {
    
    a = "light red";
    b = "light yellow";
    c = "lime";
  }
}
