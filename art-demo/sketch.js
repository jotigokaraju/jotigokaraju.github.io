//October 4, 2024
//Generative Art Demo


const TILE_SIZE = 10;
let tileArray = [];

let colour1;
let colour2;
let colour3;

function setup() {
  createCanvas(windowWidth, windowHeight);
  

  

}

function draw() {
  tileArray = [];
  for (let x = 0; x < width; x += TILE_SIZE) {
    for (let y = 0; y < height; y += TILE_SIZE) {
      tileArray.push(spawnTile(x, y));
    }
  }
  colour1 = random(255);
  colour2 = random(255);
  colour3 = random(255);
  background(colour1, colour2, colour3);
  
  for (let instance of tileArray) {
    stroke(random(255), random(255), random(255));
    strokeWeight(random(10));
    line(instance.x1, instance.y1, instance.x2, instance.y2);
    console.log(instance.x1, instance.x2);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


function spawnTile(x, y) {
  let tile;

  let choice = random(100);

  if (choice > 50) {
    tile = {
      x1: x - TILE_SIZE/2,
      y1: y - TILE_SIZE/2,
      x2: x + TILE_SIZE/2,
      y2: y + TILE_SIZE/2,
    };
  }

  else {
    tile = {
      x1: x - TILE_SIZE/2,
      y1: y + TILE_SIZE/2,
      x2: x + TILE_SIZE/2,
      y2: y - TILE_SIZE/2,
    };
  }

  return tile;
}