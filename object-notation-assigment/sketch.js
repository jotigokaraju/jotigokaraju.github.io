let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: false };
function preload() {
  faceMesh = ml5.faceMesh(options);
}
let video;
function setup() {
  createCanvas(640, 480);
  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  faceMesh.detectStart(video, gotFaces);
}
let faces = [];
// Callback function for when faceMesh outputs data
function gotFaces(results) {
  // Save the output to the faces variable
  faces = results;
}
function drawer() {
  image(video, 0, 0, width, height);
  // Draw all the tracked face points
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    for (let j = 0; j < face.keypoints.length; j++) {
      let keypoint = face.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 5);
    }
  }
}


let mover;


function draw() {
  
}

function initializeMovers() {
  // Calculate the spacing based on the width of the canvas
  let xSpacing = width / 9;

  // Fill the movers array with 9 Mover objects with random masses

  let mass = random(0.5, 3);
  let xPosition = xSpacing / 2;
  mover = new birdMovement(mass, xPosition, 0, 1, 0);
  controlBird(mass);
  
}



function controlBird(mass) {
  // Gravitational force is proportional to the mass
  let gravity = createVector(0, 0.1 * mass);

  // Apply gravitational force
  birdMovement.applyForce(gravity);

  birdMovement.move();
  birdMovement.display();

}

class birdMovement {

  constructor(m, x, y, v1, v2, g) {
    this.mass = m;
    this.position = createVector(x, y);
    this.velocity = createVector(v1, v2);
    this.forceOfGravity = g;
  }

  applyForce(force) {
    let f = p5.Vector.div(force, this.mass);
    this.acceleration.add(f);
  }

  move() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    
    stroke(0);
    strokeWeight(2);
    fill(this.color);
    ellipse(this.position.x, this.position.y, this.mass * 16, this.mass * 16);
    
  }



}
