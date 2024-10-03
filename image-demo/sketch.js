// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"



let spongebob;

let theCircle = {
  x: 50,
  y: 50,
  r: 50,
}

let theStudent = {
  name: "Riley",
}

function preload() {
  spongebob = loadImage("Spongebob.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noLoop();
  theStudent.eyecolour = "brown";
  delete theStudent.name;
}

function draw() {
  background(220);
  circle(theCircle.x, theCircle.y, theCircle.r);
  console.log(theStudent);

}
