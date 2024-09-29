

let circleX = 340;
let circleY = 220;
const circleDiameter = 50;
const keysWASD = [87, 65, 83, 68];
let moveAmount = 50;
let handPose;
let video;
let hands = [];
let vidAspectRatio = video.width / video.height;
let canAspectRatio = windowWidth / windowHeight;
let VideoWidth;
let VideoHeight;

// A variable to track a pinch between thumb and index
let pinch = 0;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  

  video.size(640, 480);
  
  video.hide();
  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  // Draw the webcam video

  
  translate(video.width, 0);
  //then scale it by -1 in the x-axis
  //to flip the image
  scale(-1, 1);
  //draw video capture feed as image inside p5 canvas
  image(video, 0, 0);
  


  // If there is at least one hand
  for (let i = 0; i < hands.length; i++) {

    if (i === 0) {
    
      let finger = hands[0].index_finger_tip;
      console.log(i);
      fill(0, 255, 0, 200);
      circle(finger.x, finger.y, 50);

    }

    else {
      let hand = hands[i]
      for (let j = 0; j < hand.keypoints.length; j++) {
        let keypoint = hand.keypoints[j];
        fill(0, 255, 0);
        noStroke();
        circle(keypoint.x, keypoint.y, 10);
      }
    }

  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}

