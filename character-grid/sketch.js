let grid;
let cellSize;
const GRID_SIZE = 50;
let shouldToggleNeighbours = false;
let play = false;
let gosper;
const CLOSED = 1;
const OPEN = 0;
const PLAYER = 9; 
let thePlayer = {
  x: 0,
  y: 0,
};
let grass, brick;

function preload() {
  gosper = loadJSON('gun.json');
  grass = loadImage('clover.jpg');
  brick = loadImage('brick.jpg');
}

function setup() {
  if (windowWidth < windowHeight) {
    createCanvas(windowWidth, windowWidth);
  }
  else {
    createCanvas(windowHeight, windowHeight);
  }
  cellSize = height/GRID_SIZE;
  grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);

  //display player on grid
  grid[thePlayer.y][thePlayer.x] = PLAYER;

}

function windowResized() {
  if (windowWidth < windowHeight) {
    resizeCanvas(windowWidth, windowWidth);
  }
  else {
    resizeCanvas(windowHeight, windowHeight);
  }
  cellSize = height/GRID_SIZE;
}

function draw() {
  background(220);
  displayGrid();
  if (play && frameCount % 2 === 0) {
    grid = updateGrid();
  }
}

function mousePressed() {
  let x = Math.floor(mouseX/cellSize);
  let y = Math.floor(mouseY/cellSize);

  //toggle self
  toggleCell(x, y);

  if (shouldToggleNeighbours) {
    //toggle neighbours
    toggleCell(x - 1, y);
    toggleCell(x + 1, y);
    toggleCell(x, y - 1);
    toggleCell(x, y + 1);
  }
}

function toggleCell(x, y) {
  //make sure the cell you're toggling is in the grid
  if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
    if (grid[y][x] === OPEN) {
      grid[y][x] = CLOSED;
    }
    else {
      grid[y][x] = OPEN;
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(GRID_SIZE, GRID_SIZE);
  }
  if (key === "e") {
    grid = generateEmptyGrid(GRID_SIZE, GRID_SIZE);
  }
  if (key === "n") {
    shouldToggleNeighbours = !shouldToggleNeighbours;
  }
  if (key === " ") {
    grid = updateGrid();
  }

  if (key === 'g') {
    grid = gosper;
  }

  if (key === 'w') {
    movePlayer(thePlayer.x, thePlayer.y - 1);
  }

  if (key === 'a') {
    movePlayer(thePlayer.x - 1, thePlayer.y);
  }

  if (key === 's') {
    movePlayer(thePlayer.x, thePlayer.y + 1);
  }

  if (key === 'd') {
    movePlayer(thePlayer.x + 1, thePlayer.y);
  }
}

function movePlayer(x, y) {
  

  if (grid[y][x] === OPEN) {
    let oldX = thePlayer.x;
    let oldY = thePlayer.y;
    thePlayer.x = x;
    thePlayer.y = y;
    grid[thePlayer.y][thePlayer.x] = PLAYER;
    grid[oldY][oldX] = OPEN;
  }

  
}

function updateGrid() {
  //make another array to hold the next turn
  let nextTurn = generateEmptyGrid(GRID_SIZE, GRID_SIZE);

  //look at every cell
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      let neighbours = 0;

      //look at every neighbour around it
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          //don't fall off the edge
          if (x+j >= 0 && x+j < GRID_SIZE && y+i >= 0 && y+i < GRID_SIZE) {
            neighbours += grid[y+i][x+j];
          }
        }
      }

      //don't count yourself as a neighbour
      neighbours -= grid[y][x];

      //apply the rules
      if (grid[y][x] === CLOSED) { //alive
        if (neighbours === 2 || neighbours === 3) {
          nextTurn[y][x] = CLOSED;
        }
        else {
          nextTurn[y][x] = OPEN;
        }
      }

      if (grid[y][x] === OPEN) { //dead
        if (neighbours === 3) {
          nextTurn[y][x] = CLOSED;
        }
        else {
          nextTurn[y][x] = OPEN;
        }
      }
    }
  }
  return nextTurn;
}


function displayGrid() {
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {

      if (grid[y][x] === CLOSED) {
        image(grass, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === OPEN) {
        image(brick, x * cellSize, y * cellSize, cellSize, cellSize);
      }
      else if (grid[y][x] === PLAYER) {
        fill("red");
        noStroke();
        square(x * cellSize, y * cellSize, cellSize);
      }

      
    }
  }
}


function generateRandomGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      //make it a 1 half the time, a 0 half the time
      if (random(100) < 50) {
        newGrid[y].push(1);
      }
      else {
        newGrid[y].push(0);
      }
    }
  }
  return newGrid;
}

function generateEmptyGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
}