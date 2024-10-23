// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let grid;
let cellSize;

function setup() {
  grid = generateRandomGrid(10, 10);
  createCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  if (key === 'r') {
    grid = generateRandomGrid(10, 10);
  }

  if (key === 'e') {
    grid = grid.fill(0);
  }
}

function draw() {
  windowResized();
  background(220);
  displayGrid();
  
}

function displayGrid() {
  for (let i = 0; i < grid.length; i++) {
    for (x = 0; x < grid.length; x++) {
      if (grid[i][x] === 1) {
        fill("purple");
      } else {
        fill("blue");
      }
      square(x*cellSize, i*cellSize, cellSize);
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
      newGrid[y].push(Math.round(Math.random(0, 1)))
    }
  }
  return newGrid;
}

function mousePressed() {
  for (let y = 0; y < grid.length; y++) {
    for (x = 0; x < grid.length; x++) {
      if ((mouseX >= (x)*cellSize && mouseX <= (x+1)*cellSize) && (mouseY >= (y)*cellSize && mouseY <= (y+1)*cellSize)) {
        if (grid[y][x] === 0) {
          grid[y][x] = 1;
        } else {
          grid[y][x] = 0;
        }
        
      }
    }
  }
}