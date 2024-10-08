// Terrain Generation
// October 7 2024

let time = 0;
let terrain = [];
const NUMBER_OF_RECTS = 2000;

function setup() {
  createCanvas(windowWidth, windowHeight);
  let widthOfRect = width/NUMBER_OF_RECTS;
  for (let i = 0; i < windowWidth; i+= widthOfRect) {
    x = noise(time) * height;
    terrain.push(spawnRectangle(i, x, i+widthOfRect));
    time += 0.001;
  }
  
}

function draw() {
  background(220);

  for (someRect of terrain) {

    fill(255, 255, 255);
    rect(someRect.x, someRect.y, someRect.w, someRect.h);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function spawnRectangle(leftSide, rectHeight, rectWidth) {
  
  let theRect = {
    x: leftSide,
    y: height - rectHeight,
    w: rectWidth,
    h: rectHeight,
  };

  return theRect;

}