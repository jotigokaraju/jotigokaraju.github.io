// Grid Demo
// Dan Schellenberg
// Oct 22, 2024

// if hardcoding the grid, use this:
// let grid = [[1, 0, 0, 1],
//             [0, 1, 1, 0],
//             [1, 0, 1, 1],
//             [1, 1, 1, 0]];

let grid;
let cellWidth;
const GRID_SIZE = 20;
let cellHeight;
let blaster;

function preload() {
  blaster = loadImage('blaster.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  cellHeight = Math.floor(height/GRID_SIZE);
  cellWidth = Math.floor(width/GRID_SIZE);
  grid = generateRandomGrid(cellHeight, cellWidth);
  angleMode(DEGREES);
}

function draw() {
  background(255, 255, 255);
  displayBlaster();
  displayGrid();
}


function displayBlaster() {
  
}



function displayGrid() {
  for (let y = 0; y < cellHeight; y++) {
    for (let x = 0; x < cellWidth; x++) {
      fill("white"); 
      noStroke();
      circle(x * GRID_SIZE, y * GRID_SIZE, GRID_SIZE);
    }
  }
}

function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < cols; y++) {
    newGrid.push([]);
    for (let x = 0; x < rows; x++) {
      if (random(100) < 50) {
        newGrid[y].push(1);
      } else {
        newGrid[y].push(0);
      }
    }
  }
  return newGrid;  
}