// Grid Demo
// Dan Schellenberg
// Oct 22, 2024



let grid;
let cellWidth;
const GRID_SIZE = 35;
let cellHeight;
let blaster;
const INDENT_BUBBLES = 20;
const SPACING_BETWEEN_BUBBLES = 1.1;
let colours;
let orangeBubble;
let purpleBubble;
let blueBubble;
let greenBubble;
let redBubble;

function preload() {
  blaster = loadImage('blaster.png');
  orangeBubble = loadImage('orangebubble.png');
  purpleBubble = loadImage('purplebubble.png');
  redBubble = loadImage('redbubble.png');
  greenBubble = loadImage('greenbubble.png');
  blueBubble = loadImage('bluebubble.png');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  cellHeight = Math.floor(windowHeight/GRID_SIZE/1.1/2.5);
  cellWidth = Math.floor((windowWidth-20)/GRID_SIZE/1.1);
  colours = [orangeBubble, purpleBubble, redBubble, greenBubble, blueBubble];
  grid = generateRandomGrid(cellHeight, cellWidth);
  angleMode(DEGREES);
  
}

function draw() {
  background(255, 255, 255);
  displayGrid();
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
        xStart = GRID_SIZE*1.1*(x+1);
      }
      else {
        xStart = GRID_SIZE*1.1*(x+1)+20;
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