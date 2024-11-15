/*

Joti Gokaraju
Computer Science 30
November 15, 2025
2D Array Assignment

Title: Bubble Shooter
Extras for Experts: Flood Fill Algorithm; ML5.JS

Goal: The goal is to pop all the bubbles by creating matches of 3+ bubbles.

Directions:
1. Aim to hit a cluster of bubbles of the same colour.
2. Press the space bar for a randomly assigned bubble shot.
3. Show a hand to the camera.
4. Touch your ring finger to your thumb to start selecting between different bubbles.
5. Open your hand back-up to fire the cannon with the selected coloured bubble.
*/


// Set-up Constants
const GRID_SIZE = 35;
const INDENT_BUBBLES = 20;
const SPACING_BETWEEN_BUBBLES = 0.1;
const CONSTANT_WIDTH_HEIGHT = 400;

// Set-up all Global Variables
let grid;
let cellHeight, cellWidth;
let colours;
let orangeBubble, purpleBubble, blueBubble, greenBubble, redBubble;
let cannonX, cannonY, cannonWidth, cannonHeight; 
let cannon;
let fireCannon;
let ballFired = [];
let bubbleFired = false;
let boomSound, popSound;
let imgX, imgY;
let startImg, finalImg;
let gameOn = "start"

// Variables from Interactive Scene Assignment
let handPose;
let video;
let hands = [];
let vidAspectRatio;
let threshold = 50;
let videoWidth, videoHeight;
let fistX, fistY;
let thumb, ringFinger;
let distanceThumbPinky;


// Load in all the images and ML files
function preload() {

  // Load the handPose model
  handPose = ml5.handPose();

  // Load the images
  purpleBubble = loadImage('purplebubble.png');
  redBubble = loadImage('redbubble.png');
  greenBubble = loadImage('greenbubble.png');
  blueBubble = loadImage('bluebubble.png');

  cannon = loadImage('cannon.png');

  startImg = loadImage('start.png');
  finalImg = loadImage('Game_Over_logo.png');

}

// Set-up everything
function setup() {

  // Set-up sound effects
  boomSound = createAudio('cannon_sound_effect.mp3');
  popSound = createAudio('bubble_pop.mp3')

  createCanvas(windowWidth, windowHeight);

  //Set-up environment for the canvas and the video resolution and recording
  createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  video.size(640, 480);

  //Hide video DOM element
  video.hide();

  //Start detecting hands from the webcam video
  handPose.detectStart(video, gotHands);

  // Set-up variables to control the size of the grid
  //Most of these numbers were from just trial & error and guessing
  cellHeight = Math.floor(height / GRID_SIZE / 1.1 / 2.5);
  cellWidth = Math.floor((width - 40) / ((1 + SPACING_BETWEEN_BUBBLES) * 35));
 
  // Set-up ratios for how the cannon should be displayed
  cannonHeight = 0.3 * height;
  cannonY = 0.8 * windowHeight; 
  cannonWidth = 0.3 * height; 
  cannonX = width / 2 - (0.5 * cannonWidth); 

  colours = [purpleBubble, redBubble, greenBubble, blueBubble];
  
  // Set-up Cannon
  fireCannon = new Cannon(cannonHeight, cannonWidth, cannonX, cannonY);
  
  // Create the grid
  grid = generateRandomGrid(cellHeight, cellWidth);  

}

// Main loop
function draw() {

  background(47, 70, 237);

  //Call the startScreen() function if the game mode is set to start
  if (gameOn === "start") {
    startScreen();
  }
  
  //Call the game logic functions if gameOn
  else if (gameOn === "true") {
    gameLogic();
  }
  
  //End the game if gameOn is false
  else if (gameOn === "false") {
    endScreen()
  }
}

// Handle the core functioning of the game
function gameLogic() {
  
  // Detect the hands
  drawhands();

  // Show the constants (grid and cannon)
  displayGrid();
  fireCannon.move();
  fireCannon.show();

  // Check if the cannon has been fired
  if (bubbleFired) {

    // While the cannon ball is active, let it move
    if (!ballFired.kill) {
      ballFired.move();
      ballFired.display();
      ballFired.checkCollision();
    }

    // Once the cannon ball is dead, use a callback function to kill it
    else {
      boomSound.onended(changeBubbleFired)
    }
    
  }

  // Check if player has won
  if (grid.every(rowsInactive)) {
    gameOn = "false";
  }

}

// Callback function for cannonball
function changeBubbleFired() {
  bubbleFired = false;
}

// Callback function for when handPose outputs data (from ml5.js reference)
function gotHands(results) {

  // Save the output to the hands variable
  hands = results;

}

// Functions to check if player has won by looking at active in each cell
function rowsInactive(row) {
  return row.every(coloumnsInactive);
}

function coloumnsInactive(coloumn) {
  return !coloumn.active;
}

// Display the 2D Bubbles Array
function displayGrid() {

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {

      // Only display active spots
      if (grid[y][x].active) {
        image(grid[y][x].colour, grid[y][x].xPosition, grid[y][x].yPosition, GRID_SIZE, GRID_SIZE);        
      }

    }
  }
}

// Function create the 2D array storing the bubbles
function generateRandomGrid(cols, rows) {

  let xStart;
  let newGrid = [];
  let yStart;

  for (let y = 0; y < cols; y++) {
    newGrid.push([]);
    for (let x = 0; x < rows; x++) {

      // Set-up spacing between rows
      yStart = (y + 1) * 1.1 * GRID_SIZE;

      // Depending on the row, set the offset so the array looks indented and set spacing between bubbles
      if (y % 2 === 0) {
        xStart = GRID_SIZE * (1 + SPACING_BETWEEN_BUBBLES) * x + INDENT_BUBBLES;
      } else {
        xStart = GRID_SIZE * (1 + SPACING_BETWEEN_BUBBLES) * x + 2 * INDENT_BUBBLES;
      }

      // I am using a dictionary to control all the properties of the bubble.
      // It made for less global variables which was useful for clarity
      newGrid[y].push({
        active: true, 
        colour: colours[Math.floor(Math.random() * colours.length)],
        xPosition: xStart,
        yPosition: yStart,
      });

    }
  }

  // Send back the randomly generated grid
  return newGrid; 

}


// Class to handle all things related to the cannon
class Cannon {

  constructor(cannonHeight, cannonWidth, cannonX, cannonY) {

    this.height = cannonHeight; // Height of the Cannon
    this.width = cannonWidth; // Width of the Cannon
    this.x = cannonX; // X Position of the Cannon
    this.y = cannonY; // Y Position of the Cannon
    this.direction = 5; // Speed

  }

  // Handle forward, backward movement of the Cannon
  move() {

    // Reverse the direction if the cannon goes out of bounds
    if (this.x > windowWidth - cannonWidth/2) {
      this.direction = this.direction * -1;
    }
    if (this.x < 0 - cannonWidth/2) {
      this.direction = this.direction * -1;
    }

    // Add Speed to the X Position
    this.x += this.direction;

  }

  // Display the cannon
  show() {
    image(cannon, this.x, this.y, this.width, this.height);
  }

}


// Handle the cannonballs
class FiringBall {

  constructor(x, y, colour) {

    this.speedY = -10;  // Initial vertical speed
    this.x = x; // Starting x position
    this.y = y; // Starting y position
    this.colour = colour; // Type of bubble
    this.fired = true; // Engage firing mechanisms
    this.kill = false;  // Keep displaying ball

  }

  move() {

    // Only fire when ball is engaged and exists
    if (this.fired && !this.kill) {
      this.y += this.speedY; 
    }

  }

  display() {

    // Only display balls that exist
    if (!this.kill) {
      image(this.colour, this.x, this.y, GRID_SIZE, GRID_SIZE);
    }

  }

  // Larger function to handle updating the grid with the cannonball and checking neighbours for connections
  checkCollision() {

    for (let row = 0; row < grid.length; row++) {
      for (let cell = 0; cell < grid[row].length; cell++) {

        // Condition 1
        let activity = grid[row][cell].active;

        // Condition 2
        let proximity = dist(this.x, this.y, grid[row][cell].xPosition, grid[row][cell].yPosition) < GRID_SIZE;

        if (activity && proximity) {

          // Put the fired ball into the grid below the ball it hit
          let insertRow = row + 1; 

          // If new row has to be created
          if (insertRow >= grid.length) {

            grid.push([]); 

            // Set-up new row with coloumns
            for (let i = 0; i < grid[row].length; i++) {
              
              // Put in placeholder ball dictionary
              grid[insertRow].push({
                active: false,
                colour: null,
                xPosition: null, 
                yPosition: null,
              });

            }
          }
          
          // Calculate the x position for the new ball based on row offset depending on even or odd position
          if (insertRow % 2 === 0) {
            let newXPosition = GRID_SIZE * (1 + SPACING_BETWEEN_BUBBLES) * cell + INDENT_BUBBLES;
          } 
          
          else {
            let newXPosition = GRID_SIZE * (1 + SPACING_BETWEEN_BUBBLES) * cell + 2 * INDENT_BUBBLES;
          }

          // Calculate the y position for the new ball
          let newYPosition = (insertRow + 1) * 1.1 * GRID_SIZE;

          // Add the new ball to the grid

          // Handle situation if the new ball is being added to a spot that is already full
          if (grid[insertRow][cell].active) {

            // Check if ball can be added to the right and then add it
            if (cell+1 <= grid[row].length) {
              grid[insertRow][cell+1] = {
                active: true,
                colour: this.colour,
                xPosition: newXPosition,
                yPosition: newYPosition,
              };

            } 

            // If ball cannot be added to the right (edge of window), kill the new ball and end
            else {
              this.kill = true;
              this.checkNeighbours(row, cell);
              return;
            }

          }

          // Handle normal new ball addition to grid
          else {
            grid[insertRow][cell] = {
              active: true,
              colour: this.colour,
              xPosition: newXPosition,
              yPosition: newYPosition,
            };
          }

          // Once the cannon ball has been added to the grid, kill it as a firing ball
          this.kill = true;

          // Call the bubble popping functions
          this.checkNeighbours(row, cell);

          // Exit
          return;

        }
      }
    }
  }

  // I used the flood-fill algorithim for this. This took super long to figure out and I used multiple tutorials.
  // While I did heavily modify code, I should note that the original architecture is not mine

  // Function to check if balls around the cannonball are of the same colour
  checkNeighbours(row, cell) {

    // Set up list of spots to be visited, and spots already visited
    let visited = [];
    let visiting = [[row, cell]];
  
    // Only check neighbours to the left, right, up, down,upper-right, and lower-right because of how the balls look because of the offset
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, 1], [1, 1]];
    
    // Store coordinates of balls that need to be popped
    let connected = [];
  
    // Check if there are still locations to be visited
    while (visiting.length > 0) {

      // Visit the next section
      let [currentRow, currentCell] = visiting.pop();
  
      // ChatGPT gave me this line when I asked for help with debugging
      if (visited.some(([r, c]) => r === currentRow && c === currentCell)) continue;
  
      // Mark this cell as visited
      visited.push([currentRow, currentCell]);
  
      // If the color matches, add it to the connected array
      if (grid[currentRow][currentCell].active && grid[currentRow][currentCell].colour === this.colour) {
        connected.push([currentRow, currentCell]);
  
        // Check all directions
        for (let [vertical, horizontal] of directions) {

          let verticalLocation = currentRow + vertical;
          let horizontalLocation = currentCell + horizontal;
  
          // Check if positions are within bounds
          if (verticalLocation >= 0 && verticalLocation < grid.length && horizontalLocation >= 0 && horizontalLocation < grid[verticalLocation].length) {
            
            // Visit the surrounding locations next
            visiting.push([verticalLocation, horizontalLocation]);

          }
        }
      }
    }
  
    // Start killing bubbles if at least 3 exist
    if (connected.length >= 3) {

      // Kill all bubbles that are connected
      this.popBubblesIndividually(connected);

    }
  }

  // Recursive function to pop one bubble at a time
  popBubblesIndividually(bubbles) {
    
    // Exit if all bubbles have been popped
    if (bubbles.length === 0) {
      return;
    }
    
    // Continue if bubbles remain
    else {
      
      // Take first bubble from list and pop it
      let [y, x] = bubbles.shift(); 
      grid[y][x].active = false;
      
      // Play the pop sound
      popSound.play();

      // This was a ChatGPT coded line because I couldn't get popSound.onended(this.popBubblesIndividually(bubbles)) to work for some reason?
      popSound.onended(() => {
        this.popBubblesIndividually(bubbles);
      });

    }

  }
  
}

// Handle space bar firing
function keyPressed() {

  if (key === ' ' && !bubbleFired) {

    // Fire a new ball from the cannon position
    boomSound.play()
    ballFired = new FiringBall(fireCannon.x + cannonWidth / 2, fireCannon.y, random(colours));
    bubbleFired = true;

  }
}



//Taking code from Interactive Scene Assignment with some adjustments

//Main code to control the hand movements
//Used code structure borrowed from ml5.js reference but it's mostly changed
function drawhands() {
  
  if (hands.length > 0) {
  // Only consider the first hand it detects for the trigger
  let hand = hands[0];

  //Iterate through the different keypoints on the hand
  for (let j = 0; j < hand.keypoints.length; j++) {
          
    let keypoint = hand.keypoints[j];

    //These lines were pulled from someone else's code online
    fistX = windowWidth - keypoint.x;
    fistY = keypoint.y;

    //Display the keypoints
    fill(0, 255, 0);
    noStroke();
    circle(fistX, fistY, 10);
          
    //Call the collisionCheck() function to check if the trigger has been engaged
    collisionCheck();

  }
}
}

//Function to handle the firing mechanism for the gun
function collisionCheck() {
   
  //Calculate the distance from the thumb and finky on the other hand to determine when the fist is closed
  thumb = hands[0].thumb_tip;
  ringFinger = hands[0].ring_finger_tip;
  distanceThumbPinky = dist(thumb.x, thumb.y, ringFinger.x, ringFinger.y);

  //If the fist is closed
  if (distanceThumbPinky < threshold) {
    
    // Play cannon firing sound
    console.log("Collision");

    //Play a gunshot sound
    boomSound.play()

    // Fire the cannon
    ballFired = new FiringBall(fireCannon.x + (cannonWidth / 2) - GRID_SIZE/2, fireCannon.y, random(colours));
    bubbleFired = true;

  }
}

//Display the starting window for the user
function startScreen() {

  //Set the image to be the centre of the screen and adjusted to be more accurate.
  imgX = windowWidth / 2 - 200;
  imgY = windowHeight / 2 - 200;

  image(startImg, imgX, imgY, CONSTANT_WIDTH_HEIGHT, CONSTANT_WIDTH_HEIGHT);

  //If the mouse hovers on the image, increase the brightness
  if (mouseX > imgX && mouseX < imgX + CONSTANT_WIDTH_HEIGHT && mouseY > imgY && mouseY < imgY + CONSTANT_WIDTH_HEIGHT) {
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
  if (mouseX > imgX && mouseX < imgX + CONSTANT_WIDTH_HEIGHT && mouseY > imgY && mouseY < imgY + CONSTANT_WIDTH_HEIGHT && gameOn === "start") {
    gameOn = "true";
  }

}

//Display the Screen at the End
function endScreen() {

  //Reuse the start image variables
  image(finalImg, imgX, imgY, CONSTANT_WIDTH_HEIGHT, CONSTANT_WIDTH_HEIGHT);

}

// Function to resize browser tab
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}