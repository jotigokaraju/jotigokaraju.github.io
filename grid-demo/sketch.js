// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let grid;
let cellSize;

function setup() {
  grid = generateRandomGrid(6, 6);
  createCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'r') {
    grid = generateRandomGrid(4, 4);
  }

  if (key === 'e') {
    playGame(grid);
  }
}

function draw() {
  background(220);
  displayGrid();
    
}

function displayGrid() {
  for (let a = 0; a < grid.length; a++) {
    for (let b = 0; b < grid.length; b++) {
      if (grid[a][b] === 1) {
        fill("black");
      } else {
        fill("white");
      }
      square(a*cellSize, b*cellSize, cellSize);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cellSize = Math.min(height/grid.length, width/grid.length);
}

function generateRandomGrid(columns, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < columns; x++) {
      newGrid[y].push(Math.round(Math.random(0, 1)));
    }
  }
  return newGrid;
}

function mousePressed() {
  let a;
  let y = Math.floor(mouseY/cellSize);
  let x = Math.floor(mouseX/cellSize);
  if (grid[y][x] === 0) {
    a = 1;
  } else {
    a = 0;
  }

  grid[y][x] = a;
}

function toggle(x, y, a) {
  if (x >= 0 && x <= grid.length && y >= 0 && y <= grid.length) {
    grid[y][x] = a;
  }
}

function playGame(grid) {

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid.length; x++) {
      checkConditions(grid, y, x);
    }
  }
}

function checkVictory() {
  return false;
}

function checkConditions(grid, y, x) {

  //Count number of live cells around
  let counter = 0;
  for (let yCheck = -1; yCheck <= 1; yCheck++) {
    for (let xCheck = -1; xCheck <= 1; xCheck++) {
      if (x+xCheck >= 0 && x+xCheck <= grid.length && y+yCheck >= 0 && y+yCheck <= grid.length) {
        if (grid[y+yCheck][x+xCheck] === 1) {
          counter++;
        }
      }
    }
  }
  counter -= grid[y][x];

  //Condition 1
  if (counter < 2) {
    gird[y][x] = 0;
  }

  else if (counter > 3) {
    grid[y][x] = 0;
  }

  else if (grid[y][x] === 0 && counter === 3) {
    grid[y][x] = 1;
  }

  else if (grid[y][x] === 1 && (counter === 3 || counter === 2)) {
    grid[y][x] = 1; 
  }
  
}

