/*

Joti Gokaraju
Computer Science 30
October 1, 2025
Interactive Scene Assignment

Extras for Experts: ML5.JS

How to Play: 
1. One user will move the zombie with the WASD Keys. 
2. The other user will use their hands to fire based on the handPose model using the camera. 
3. One hand wil have points on the entire hand, the other will have a point on the index finger.
4. The player is trying to move their hand with the index finger to hit the zombie.
5. Once they are on top of it, they close the fist (touch the ring finger to the thumb) of their other hand with all the points on it to fire.
6. The player controlling the zombie is trying to make sure the player with the hands cannot fire onto the zombie.

*/

//Set up all Global Variables
let circleX = 440;
let circleY = 220;
const circleDiameter = 100;
const keysWASD = [87, 65, 83, 68];
const moveAmount = 10;
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

//Load the images and the model
function preload() {

  // Load the handPose model
  handPose = ml5.handPose();

  //Load the images
  img = loadImage('target.png');
  startImg = loadImage('start.png');
  finalImg = loadImage('Game_Over_logo.png');
}

//Setup function (code related to ml5.js is from reference)
function setup() {

  //Load the audio
  beat = createAudio('gun.mp3');

  //Set-up environment for the canvas and the video resolution and recording
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);

  //Set the video aspect ratio
  vidAspectRatio = video.width / video.height;

  //Hide video DOM element
  video.hide();

  //Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

}

//Draw function
function draw() {
  
  //Calculate the Offset and Video dimensions for use in other functions
  setWindowValues();
  
  // Draw the webcam video (mirrored). I asked ChatGPT 4o for this code since I didn't get the push() pop() structure
  push(); // Save the current drawing style settings and transformations
  translate(xOffset + videoWidth, yOffset); // Move to the right side of the video
  scale(-1, 1); // Flip the video horizontally
  image(video, 0, 0, videoWidth, videoHeight);
  pop(); // Restore the settings
  //End of ChatGPT code

  //Call the formatting to set-up the screen
  formatting();

  //Call the startScreen() function if the game mode is set to start
  if (gameOn === "start") {
    startScreen();
  }

  //Call the game logic functions if gameOn
  else if (gameOn === "true") {
    drawcircle();
    drawhands();
    
  }

  //End the game if gameOn is false
  else if (gameOn === "false") {
    endScreen()
  }

}


// Callback function for when handPose outputs data (from ml5.js reference)
function gotHands(results) {

  // Save the output to the hands variable
  hands = results;

}

//New function to resize browser tab (from online reference)
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

//Function to control movement of circle (changed to image of Zombie Head)
function drawcircle() {
  fill("limegreen");
  image(img, circleX, circleY, circleDiameter, circleDiameter);

  //Calculate the edges of the video
  let videoLeftEdge = xOffset;
  let videoRightEdge = xOffset + videoWidth;
  let videoTopEdge = yOffset;
  let videoBottomEdge = yOffset + videoHeight;

  //Key Control Code to only move the circle when it is within the playable area

  //W Key
  if (keyIsDown(keysWASD[0]) === true) {
    if (circleY > videoTopEdge) {
      circleY -= moveAmount;
    }
  }

  //A Key
  if (keyIsDown(keysWASD[1]) === true) {
    if (circleX > videoLeftEdge) {
      circleX -= moveAmount;
    }
  }

  //S Key
  if (keyIsDown(keysWASD[2]) === true) {
    if (circleY < videoBottomEdge - circleDiameter) {
      circleY += moveAmount;
    }
  }

  //D Key
  if (keyIsDown(keysWASD[3]) === true) {
    if (circleX < videoRightEdge - circleDiameter) {
      circleX += moveAmount;
    }
  }

}

//Main code to control the hand movements
//Used code structure borrowed from ml5.js reference but it's mostly changed
function drawhands() {

  // Draw hand keypoints
  if (hands.length > 0) {
    for (let i = 0; i < hands.length; i++) {

      //Set the first finger as the gun
      if (i === 0) {

        //Use the index finger as the gun pointer
        let finger = hands[0].index_finger_tip;

        //These lines were pulled from someone else's code online
        gunX = map(video.width - finger.x, 0, video.width, 0, videoWidth) + xOffset; // Mirrored x-coordinate
        gunY = map(finger.y, 0, video.height, 0, videoHeight) + yOffset;
        
        //Display the gun pointer
        fill(0, 255, 0);
        circle(gunX, gunY, 50);

      } 
      
      //Set the second finger as the trigger hand
      else {
        let hand = hands[i];

        //Iterate through the different keypoints on the hand
        for (let j = 0; j < hand.keypoints.length; j++) {
          
          let keypoint = hand.keypoints[j];

          //These lines were pulled from someone else's code online
          fistX = map(video.width - keypoint.x, 0, video.width, 0, videoWidth) + xOffset; // Mirrored x-coordinate
          fistY = map(keypoint.y, 0, video.height, 0, videoHeight) + yOffset;

          //Display the keypoints
          fill(0, 255, 0);
          noStroke();
          circle(fistX, fistY, 10);
          
          //Call the collisionCheck() function to check if the gun has been fired
          collisionCheck(i);

        }
      }
    }
  }
}

//Basic code to set up the location of the playable area on the centre of the screen.
function setWindowValues() {

  // Calculate new dimensions to maintain aspect ratio
  if (windowWidth / windowHeight > vidAspectRatio) {
    videoHeight = windowHeight;
    videoWidth = videoHeight * vidAspectRatio;
  } 
  
  else {
    videoWidth = windowWidth;
    videoHeight = videoWidth / vidAspectRatio;
  }
  
  // Center the video
  xOffset = (windowWidth - videoWidth) / 2;
  yOffset = (windowHeight - videoHeight) / 2;

}

//Basic formatting
function formatting() {

  background(0);

  //Create a rectangle in the dimensions of the playable area
  stroke(255);
  strokeWeight(10);
  fill('skyblue');
  rect(xOffset, yOffset, videoWidth, videoHeight);
  noStroke();

}

//Function to handle the firing mechanism for the gun
function collisionCheck(i) {
  
  //Calculate the coordinates of the image
  let circleCenterX = circleX + circleDiameter / 2;
  let circleCenterY = circleY + circleDiameter / 2;

  //Calculate the distance from the gun and the image
  let fistDistance = dist(gunX, gunY, circleCenterX, circleCenterY);
  
  //Calculate the distance from the thumb and finky on the other hand to determine when the fist is closed
  thumb = hands[i].thumb_tip;
  ringFinger = hands[i].ring_finger_tip;
  distanceThumbPinky = dist(thumb.x, thumb.y, ringFinger.x, ringFinger.y);

  //If the fist is closed
  if (distanceThumbPinky < threshold) {

    //Play a gunshot sound
    beat.play()

    //If the shot was accurate, end the game
    if (fistDistance <= collisionMargin) {
      console.log("Collision");
      gameOn = "false";
    } 
    
    //If the shot was inaccurate, keep playing
    else {
      console.log("No Collision");
    }
  }
}


//Display the starting window for the user
function startScreen() {

  //Set the image to be the centre of the screen and adjusted to be more accurate.
  imgX = windowWidth / 2 - 200;
  imgY = windowHeight / 2 - 200;
  imgW = 400;
  imgH = 400;
  image(startImg, imgX, imgY, 400, 400);

  //If the mouse hovers on the image, increase the brightness
  if (mouseX > imgX && mouseX < imgX + imgW && mouseY > imgY && mouseY < imgY + imgH) {
    filter(DILATE);
  } 
  
  //If the mouse is not on the start button, make everything black & white
  else {
    filter(THRESHOLD);
  }

  
}

//Handle events when mouse is pressed
function mousePressed() {

  //If the mouse is pressed to start the game
  if (mouseX > imgX && mouseX < imgX + imgW && mouseY > imgY && mouseY < imgY + imgH && gameOn === "start") {
    gameOn = "true";
  }

  //If the mouse is pressed to restart the game
  if (gameOn === "false") {
    gameOn = "start";
  }
}

//Display the Screen at the End
function endScreen() {

  //Reuse the start image variables
  image(finalImg, imgX, imgY, 400, 400);

  //Display text message
  fill(255);  
  textAlign(CENTER, CENTER);
  textSize(32);
  text("You Win, Click Anywhere to Restart", width/2, imgY + 450);

}
