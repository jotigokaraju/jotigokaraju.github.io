/*

Joti Gokaraju
Computer Science 30
October 1
Interactive Scene Assignment

Extras for Experts: ML5.JS

How to Play: 
1. One user will move the zombie with the WASD Keys. 
2. The other user will use their hands to fire based on the handPose model using the camera. 
3. One hand wil have points on the entire hand, the other will have a point on the index finger.
4. The player is trying to move their hand with the index finger to hit the zombie.
5. Once they are on top of it, they close the fist of their other hand with all the points on it to fire.
6. The player controlling the zombie is trying to make sure the player with the hands cannot fire onto the zombie.

*/

//Set up all Global Variables
let circleX = 340;
let circleY = 220;
const circleDiameter = 100;
const keysWASD = [87, 65, 83, 68];
let moveAmount = 10;
let handPose;
let video;
let hands = [];
let vidAspectRatio;
let threshold = 50;
let videoWidth, videoHeight;
let gunX, gunY, fistX, fistY;
let img;
let xOffset, yOffset;
let gameOn = "start";
let thumb, ringFinger;
let distanceThumbPinky;
const collisionMargin = 50;
let imgX, imgY, imgW, imgH;


function preload() {
  // Load the handPose model
  handPose = ml5.handPose();
  img = loadImage('target.png');
  startImg = loadImage('start.png');
  finalImg = loadImage('Game_Over_logo.png');
}

function setup() {

  beat = createAudio('gun_laser.mp3');


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
  
  setWindowValues();
  
  // Draw the webcam video (mirrored). I asked ChatGPT 4o for this code since I didn't get the push() pop() structure
  push(); // Save the current drawing style settings and transformations
  translate(xOffset + videoWidth, yOffset); // Move to the right side of the video
  scale(-1, 1); // Flip the video horizontally
  image(video, 0, 0, videoWidth, videoHeight);
  pop(); // Restore the settings

  formatting();

  if (gameOn === "start") {
    startScreen();
  }

  else if (gameOn === "true") {
    drawcircle();
    drawhands();
    
  }

  else if (gameOn === "false") {
    endScreen()
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
  image(img, circleX, circleY, circleDiameter, circleDiameter);

  let videoLeftEdge = xOffset;
  let videoRightEdge = xOffset + videoWidth;
  let videoTopEdge = yOffset;
  let videoBottomEdge = yOffset + videoHeight;

  if (keyIsDown(keysWASD[0]) === true) {
    if (circleY > videoTopEdge) {
      circleY -= moveAmount;
    }
  }

  if (keyIsDown(keysWASD[1]) === true) {
    if (circleX > videoLeftEdge) {
      circleX -= moveAmount;
    }
  }

  if (keyIsDown(keysWASD[2]) === true) {
    if (circleY < videoBottomEdge - circleDiameter) {
      circleY += moveAmount;
    }
  }

  if (keyIsDown(keysWASD[3]) === true) {
    if (circleX < videoRightEdge - circleDiameter) {
      circleX += moveAmount;
    }
  }

}

function drawhands() {
  // Draw hand keypoints
  if (hands.length > 0) {
    for (let i = 0; i < hands.length; i++) {

      if (i === 0) {
        let finger = hands[0].index_finger_tip;

        
        gunX = map(video.width - finger.x, 0, video.width, 0, videoWidth) + xOffset; // Mirrored x-coordinate
        gunY = map(finger.y, 0, video.height, 0, videoHeight) + yOffset;

        fill(0, 255, 0, 200);
        circle(gunX, gunY, 50);
        console.log(gunX, gunY);
      } 
      
      else {
        let hand = hands[i];
        for (let j = 0; j < hand.keypoints.length; j++) {
          let keypoint = hand.keypoints[j];

          
          fistX = map(video.width - keypoint.x, 0, video.width, 0, videoWidth) + xOffset; // Mirrored x-coordinate
          fistY = map(keypoint.y, 0, video.height, 0, videoHeight) + yOffset;

          fill(0, 255, 0);
          noStroke();
          circle(fistX, fistY, 10);
          
          collisionCheck(i);

        }
      }
    }
  }
}

function setWindowValues() {
  // Calculate new dimensions to maintain aspect ratio
  if (windowWidth / windowHeight > vidAspectRatio) {
    videoHeight = windowHeight;
    videoWidth = videoHeight * vidAspectRatio;
  } else {
    videoWidth = windowWidth;
    videoHeight = videoWidth / vidAspectRatio;
  }
  

  // Center the video on the canvas
  xOffset = (windowWidth - videoWidth) / 2;
  yOffset = (windowHeight - videoHeight) / 2;
}

function formatting() {
  background(0);
  stroke(255);
  strokeWeight(10);
  fill('skyblue');
  rect(xOffset, yOffset, videoWidth, videoHeight);
  noStroke();
}

function collisionCheck(i) {
  
  let circleCenterX = circleX + circleDiameter / 2;
  let circleCenterY = circleY + circleDiameter / 2;

  
  let fistDistance = dist(gunX, gunY, circleCenterX, circleCenterY);
  
  //console.log(`Fist Position: (${gunX}, ${gunY})`);
  //console.log(`Circle Position: (${circleCenterX}, ${circleCenterY})`);
  //console.log(`Distance: ${fistDistance}`);

  thumb = hands[i].thumb_tip;
  ringFinger = hands[i].ring_finger_tip;
  
 
  distanceThumbPinky = dist(thumb.x, thumb.y, ringFinger.x, ringFinger.y);


  if (distanceThumbPinky < threshold) {
    beat.play()
    if (fistDistance <= collisionMargin) {
      console.log("Collision");
      gameOn = "false";
    } 
    
    else {
      console.log("No Collision");
    }
  }
}



function startScreen() {
  imgX = windowWidth / 2 - 200;
  imgY = windowHeight / 2 - 200;
  imgW = 400;
  imgH = 400;
  image(startImg, imgX, imgY, imgW, imgH);
  if (mouseX > imgX && mouseX < imgX + imgW && mouseY > imgY && mouseY < imgY + imgH) {
   
    filter(DILATE);
  } 
  
  else {
    filter(THRESHOLD);
  }

  
}

function mousePressed() {

  if (mouseX > imgX && mouseX < imgX + imgW && mouseY > imgY && mouseY < imgY + imgH && gameOn === "start") {
    gameOn = "true";
  }

  if (gameOn === "false") {
    gameOn = "start";
  }
}

function endScreen() {
  imgW = 400;
  imgH = 400;
  image(finalImg, imgX, imgY, 400, 400);
}


function endScreen() {
  imgW = 400;
  image(finalImg, imgX, imgY, imgW, imgH);
  fill(255);  
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You Win, Click Anywhere to Restart", width/2, imgY + 450);
}
