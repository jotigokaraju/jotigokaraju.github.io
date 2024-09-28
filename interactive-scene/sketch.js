/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

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
  // create the canvas
 createCanvas(640, 480);
  /* capture the video feed and set it to the width and height of the current canvas */
 video = createCapture(VIDEO);
 video.size(width, height);

  /* print to let us know that handpose model (which is initialized on the next line) is loading */
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