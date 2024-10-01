let circleX = 340;
let circleY = 220;
const circleDiameter = 50;
const keysWASD = [87, 65, 83, 68];
let moveAmount = 50;
let handPose;
let video;
let hands = [];
let vidAspectRatio;

function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480); // Set the video size to its default resolution

  // Get the video aspect ratio
  vidAspectRatio = video.width / video.height;

  // Hide video DOM element
  video.hide();

  // Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);
}

function draw() {
  background(255);

  // Calculate new dimensions to maintain aspect ratio
  let videoWidth, videoHeight;
  if (windowWidth / windowHeight > vidAspectRatio) {
    videoHeight = windowHeight;
    videoWidth = videoHeight * vidAspectRatio;
  } else {
    videoWidth = windowWidth;
    videoHeight = videoWidth / vidAspectRatio;
  }

  // Center the video on the canvas
  let xOffset = (windowWidth - videoWidth) / 2;
  let yOffset = (windowHeight - videoHeight) / 2;

  // Draw the webcam video (mirrored). I asked ChatGPT 4o for this code since I didn't get the push() pop() structure
  push(); // Save the current drawing style settings and transformations
  translate(xOffset + videoWidth, yOffset); // Move to the right side of the video
  scale(-1, 1); // Flip the video horizontally
  image(video, 0, 0, videoWidth, videoHeight);
  pop(); // Restore the settings

  background(255);

  drawcircle()
  // Draw hand keypoints
  if (hands.length > 0) {
    for (let i = 0; i < hands.length; i++) {

      if (i === 0) {
        let finger = hands[0].index_finger_tip;

        // Map the finger coordinates to the new video size
        let x = map(video.width - finger.x, 0, video.width, 0, videoWidth) + xOffset; // Mirrored x-coordinate
        let y = map(finger.y, 0, video.height, 0, videoHeight) + yOffset;

        fill(0, 255, 0, 200);
        circle(x, y, 50);
      } 
      
      else {
        let hand = hands[i];
        for (let j = 0; j < hand.keypoints.length; j++) {
          let keypoint = hand.keypoints[j];

          // Map the keypoint coordinates to the new video size
          let x = map(video.width - keypoint.x, 0, video.width, 0, videoWidth) + xOffset; // Mirrored x-coordinate
          let y = map(keypoint.y, 0, video.height, 0, videoHeight) + yOffset;

          fill(0, 255, 0);
          noStroke();
          circle(x, y, 10);
        }
      }
    }
  }
}


// Callback function for when handPose outputs data
function gotHands(results) {
  // Save the output to the hands variable
  hands = results;
}


//New Function when I resize browser tab
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
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
      circleX -= moveAmount;
    }
  }

  if (keyIsDown(keysWASD[2]) === true) {
    if (circleY < windowHeight - circleDiameter/2) {
      circleY += moveAmount;
    }

  }


  if (keyIsDown(keysWASD[3]) === true) {
    if (circleX > circleDiameter/2) {
      circleX += moveAmount;
    }

  }
}