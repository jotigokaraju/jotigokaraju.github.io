/*

Joti Gokaraju
Computer Science 30
October 21, 2024
Object Notation Assignment

Extras for Experts: ML5.JS; Classes

Flappy Bird with Voice (Saying "Up") and Keyboard Control with Space Bar
Please use this with a computer that has a reasonably good quality mic. 
*/


//Set up all Global Variables
let bird;
let gravity;
let jumpForce;
let pipes = [];
let gameOn = "start";
let pipeSpacing = 200; 
let classifier;
const WORDOPTIONS = ["up", "play", "go", "yes"];
let predictedWord;
let imgX, imgY, imgW, imgH;
let img, startImg, finalImg, bg;
const SPACE = 300;


//Preload all the neccessary functions and images
function preload() {

  //Set-up the sound recognition
  let options = { probabilityThreshold: 0.7 };
  classifier = ml5.soundClassifier("SpeechCommands18w", options);

  //Load in the images
  img = loadImage('bird.png');
  startImg = loadImage('start.png');
  finalImg = loadImage('Game_Over_logo.png');
  bg = loadImage('background.jpg');

}


//Set-up call-back for when sound is recorded
function gotResult(results) {

  predictedWord = results[0].label;

  //If the sound is one of the move commands, jump the bird
  if (WORDOPTIONS.includes(predictedWord)) {
    bird.jump();
  }

}


//Set-up the contingency keyboard presses if no mic is there
function keyPressed() {

  //Check if key is space bar
  if (key === ' ') {
    bird.jump();
  }

}


//Resize window
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


//Set-up function
function setup() {

  createCanvas(windowWidth, windowHeight);

  //Set-up sound classifier
  classifier.classifyStart(gotResult);

  //Based on online tutorial for vectors
  gravity = createVector(0, 0.5);
  jumpForce = createVector(0, -10);

  //Based on online tutorial, I learned the new structure
  bird = new Bird();
  let pipe = new Pipe();
  pipes.push(pipe);

}


//Draw loop
function draw() {

  //Set-up the beach as the background
  background(bg);

  //Call the startScreen() function if the game mode is set to start
  if (gameOn === "start") {
    startScreen();
  } 

  //Call the game logic functions if gameOn is true
  else if (gameOn === "true") {
    playGame();
  } 

  //End the game if gameOn is false
  else if (gameOn === "false") {
    endScreen();
  }

}


//Control the game logic
function playGame() {

  //Show the bird
  bird.update();
  bird.show();

  //I asked ChatGPT because I didn't know why the pipes were spaced irregularly, I tried this.
  //It is a bit better but is still a bit random
  if (frameCount % pipeSpacing === 0) {

    //Create new pipes every set time interval
    let pipe = new Pipe();
    pipes.push(pipe);

  }

  //Display all the pipes in the array
  for (let i = 0; i < pipes.length; i++) {

    //Display pipes
    pipes[i].update();
    pipes[i].show();
  
    //Check if the bird is near the pipe and end the game if so
    if (pipes[i].hits(bird)) {
      gameOn = "false";
    }

  }

  //Check if the bird is on the ground and end the game if so
  if (bird.birdControls.position.y > height) {
    gameOn = "false";
  }

}


//Classes
//The classes were based off a tutorial. I did rewrite them and adjust them for the assignment, but the overarching program architecture is not original.

//Class to control bird
class Bird {

  //Set-up localized values
  constructor() {

    //Set-up object that contains all the values of the bird
    this.birdControls = {
      position: createVector(50, height / 2),
      velocity: createVector(0, 0),
      acceleration: createVector(0, 0),
      radius: 16,
    };
  }

  //When applyforce is called, change the acceleration by the force
  applyForce(force) {
    this.birdControls.acceleration.add(force);
  }

  //Handle the update calls
  update() {

    //Apply gravity
    this.applyForce(gravity);

    //Taken directly from tutorial and used with changed variables
    //Calculate the new position based on the velocity and acceration vectors
    this.birdControls.velocity.add(this.birdControls.acceleration);
    this.birdControls.position.add(this.birdControls.velocity);
    this.birdControls.acceleration.mult(0);

    //Do not let the velocity infinately accelerate
    if (this.birdControls.velocity.y > 10) {
      this.birdControls.velocity.y = 10;
    }

    //Do not let the bird keep moving past the top
    if (this.birdControls.position.y < 0) {
      this.birdControls.position.y = 0;
      this.birdControls.velocity.y = 0;
    }

  }

  //Handle the jump calls
  jump() {

    //Taken directly from tutorial with changed variables
    //Reset the velocity
    this.birdControls.velocity.y = 0;

    //Add the force of the jump vector
    this.applyForce(jumpForce); 
  }

  //Display the bird
  show() {
    image(img, this.birdControls.position.x, this.birdControls.position.y, this.birdControls.radius * 2, this.birdControls.radius * 2);
  }

}

//Class to control the pipe
class Pipe {

  //Set-up local variables
  constructor() {

    //Declare the top since I need to reference it multiple times within the object
    let top = random((1/6) * height, (0.75) * height);
    
    //Declare the object
    this.pipeControls = {
      top: top,
      bottom: height - (top + SPACE),
      x: width,
      w: 40,
      speed: 3,
    };
  }
  
  //When update is called, keep moving pipe to the left by the speed
  update() {
    this.pipeControls.x -= this.pipeControls.speed;
  }

  //Display the pipes
  show() {

    //Set fill colour to be green
    fill("green");

    //Display top pipe
    rect(this.pipeControls.x, 0, this.pipeControls.w, this.pipeControls.top);

    //Display bottom pipe
    rect(this.pipeControls.x, height - this.pipeControls.bottom, this.pipeControls.w, this.pipeControls.bottom);

  }

  //Check if pipe is colliding with the bird
  hits(bird) {

    //Return true if the bird is within the top or bottom pipe and within their widths
    return ((bird.birdControls.position.y < this.pipeControls.top || bird.birdControls.position.y > height - this.pipeControls.bottom) && (bird.birdControls.position.x > this.pipeControls.x && bird.birdControls.position.x < this.pipeControls.x + this.pipeControls.w));
  
  }

}





//Taking code from Interactive Scene Assignment


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

}

//Display the Screen at the End
function endScreen() {

  //Reuse the start image variables
  image(finalImg, imgX, imgY, 400, 400);

}
