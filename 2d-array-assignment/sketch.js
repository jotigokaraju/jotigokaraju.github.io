// Grid Demo
// Dan Schellenberg
// Oct 22, 2024



let grid;
let cellWidth;
const GRID_SIZE = 35;
let cellHeight;
let blaster;
const INDENT_BUBBLES = 20;
const SPACING_BETWEEN_BUBBLES = 0.1;
let colours;
let orangeBubble;
let purpleBubble;
let blueBubble;
let greenBubble;
let redBubble;
let cannonX;
let cannonY;
let cannonWidth;
let cannonHeight; 
let cannon;
let rotationAngle;
let fireCannon;
let ballFired;

function preload() {
  blaster = loadImage('blaster.png');
  purpleBubble = loadImage('purplebubble.png');
  redBubble = loadImage('redbubble.png');
  greenBubble = loadImage('greenbubble.png');
  blueBubble = loadImage('bluebubble.png');
  cannon = loadImage('cannon.png');
  
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  cellHeight = Math.floor(windowHeight/GRID_SIZE/1.1/2.5);
  cellWidth = Math.floor((windowWidth-40)/((1+SPACING_BETWEEN_BUBBLES)*35));
  colours = [purpleBubble, redBubble, greenBubble, blueBubble];
  grid = generateRandomGrid(cellHeight, cellWidth);
  angleMode(DEGREES);  
  cannonHeight = 0.3*windowHeight;
  cannonY = 0.8*windowHeight; 
  cannonWidth = 0.2*windowWidth; 
  cannonX = windowWidth/2 - 0.5*cannonWidth; 
  fireCannon = new Cannon(cannonHeight, cannonWidth, cannonX, cannonY);
  ballFired = new FiringBall();
}

function draw() {
  background(47, 70, 237);
  displayGrid();
  fireCannon.move();
  fireCannon.show(cannon);
  console.log(windowWidth);
  ballFired.fire("blue");
}




function displayGrid() {
  for (let y = 0; y < cellHeight; y++) {
    for (let x = 0; x < cellWidth; x++) {
      if (grid[y][x].active) {
        image(grid[y][x].colour, grid[y][x].xPosition, grid[y][x].yPosition, GRID_SIZE, GRID_SIZE);        
      }
    }
  }
}


function generateRandomGrid(cols, rows) {
  let xStart;
  let newGrid = [];
  let yStart;
  for (let y = 0; y < cols; y++) {
    newGrid.push([]);
    for (let x = 0; x < rows; x++) {
      yStart = (y+1)*1.1*GRID_SIZE;
      if (y%2 === 0) {
        xStart = GRID_SIZE*(1+SPACING_BETWEEN_BUBBLES)*(x)+INDENT_BUBBLES;
      }
      else {
        xStart = GRID_SIZE*(1+SPACING_BETWEEN_BUBBLES)*(x)+2*INDENT_BUBBLES;
      }
      newGrid[y].push({active:true, 
        colour:colours[Math.floor(Math.random() * colours.length)],
        xPosition: xStart,
        yPosition: yStart,
      });
    }
  }
  return newGrid;  
}


class Cannon {
  constructor(cannonHeight, cannonWidth, cannonX, cannonY) {
    this.height = cannonHeight;
    this.width = cannonWidth;
    this.x = cannonX;
    this.y = cannonY;
    this.direction = 5;
  }

  move() {
    if (this.x > windowWidth-cannonWidth/2) {
      this.direction = this.direction*-1;
    }
    if (this.x < 0-cannonWidth/4) {
      this.direction = this.direction*-1;
    }

    this.x += this.direction;
  }

  show(images) {
    this.image = images;
    image(this.image, this.x, this. y, this.height, this.width);
  }
}

class FiringBall extends Cannon {
  constructor() {
    
  }

  super.show(blueBubble);
    //console.log(this.inertia);
  //}


}