/*
 * 👋 Hello! This is an ml5.js example made and shared with ❤️.
 * Learn more about the ml5.js project: https://ml5js.org/
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next-gen/blob/main/LICENSE.md
 *
 * This example demonstrates hand tracking on live video through ml5.handPose.
 */

let handPose;
let video;
let hands = [];
let circleX = 340;
let circleY = 220;
const circleDiameter = 50;
const keysWASD = [87, 65, 83, 68];
let moveAmount = 50;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}


function setup() {
  //createCanvas(640, 480);
  createCanvas(windowWidth, windowHeight);
  
  video = createCapture(VIDEO);
  //video.size(640, 480);
  video.size(windowWidth, windowHeight);
  video.hide();
  
  
  handPose.detectStart(video, gotHands);
}

function draw() {
  
  

  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);

  
  drawcircle();

  drawObject(); 

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
      
    }
  }

  

}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}

function drawObject () {
  
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