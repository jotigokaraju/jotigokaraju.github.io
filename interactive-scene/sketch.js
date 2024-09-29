/*

let circleX = 340;
let circleY = 220;
const circleDiameter = 50;
const keysWASD = [87, 65, 83, 68];
let moveAmount = 50;

//variable for handpose ml model
let handpose;
//variable to store the video feed
let video;
//array for hand point predictions
let predictions = [];

function setup() {
  
 createCanvas(640, 480);

 video = createCapture(VIDEO);
 video.size(width, height);


  print("loading")
  // call modelReady() when it is loaded
  handpose = ml5.handpose(video, modelReady);
  // Hide the video element, and just show the canvas
  video.hide();
}
// when the model is ready, a message appears in the console and it predicts where each landmark should be placed
function modelReady() {
  console.log("Model ready!");
    handpose.on("predict", function(results) {
    predictions = results;
  });
  handpose.predict(video);
}

function draw() {
  // render the video feed
  image(video, 0, 0, width, height);
  // We can call a function to draw using the keypoints
  drawObject();
}
// A function to draw a ball at the tip of the finger
function drawObject() {
  if (predictions.length > 0) {
    let prediction = predictions[0];
    let x = prediction.annotations.indexFinger[3][0]
    let y = prediction.annotations.indexFinger[3][1]
    print(prediction, x, y)
    fill(51);
    noStroke();
  
    // A small ellipse to track the finger
    ellipse(round(x), round(y), 50, 50) 
      
    // If the finger point is in the left of the screen, draw the first rectangle; otherwise draw the second
    if (x < (300)) {
      rect(0, 0, 300, 480);  // Left
    }
    else {
      rect(300, 0, 300, 480); // Right
    }
  }
}



function drawcircle() {
  fill("limegreen");
  circle(circleX, circleY, circleDiameter);

  
  if (keyIsDown(keysWASD[0]) === true) {
    if (circleY > circleDiameter/2) {
      circleY -= moveAmount;
    }
  }

  if (keyIsDown(keysWASD[1]) === true) {
    if (circleX < windowWidth - circleDiameter/2) {
      circleX += moveAmount;
    }
  }

  if (keyIsDown(keysWASD[2]) === true) {
    if (circleY < windowHeight - circleDiameter/2) {
      circleY += moveAmount;
    }
    
  }

  if (keyIsDown(keysWASD[3]) === true) {
    if (circleX > circleDiameter/2) {
      circleX -= moveAmount;
    }
    
  }
}

*/


/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates tracking particular parts of the hand through ml5.handPose.
 */

let handPose;
let video;
let hands = [];

// A variable to track a pinch between thumb and index
let pinch = 0;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  // Create the webcam video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video
  image(video, 0, 0, width, height);

  // If there is at least one hand
  for (let i = 0; i < hands.length; i++) {
    // Find the index finger tip and thumb tip
    let finger = hands[0].index_finger_tip;
    console.log(i);
    
    


    // This circle's size is controlled by a "pinch" gesture
    fill(0, 255, 0, 200);
    stroke(0);
    strokeWeight(2);
    circle(finger.x, finger.y, 50);

  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

