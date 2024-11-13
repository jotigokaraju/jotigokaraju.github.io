// Walker Demo

let Winston;
let George;
const keysWASD = [87, 65, 83, 68];

class Walker {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = 10;
    this.radius = 5;
  }

  display() {
    fill("blue");
    circle(this.x, this.y, this.radius*2);
  }

  move(direction) {

    this.direction = direction;

    if (this.direction === "up") {
      this.y -= this.speed;
    }

    if (this.direction === "down") {
      this.y += this.speed;
    }

    if (this.direction === "left") {
      this.x -= this.speed;
    }

    if (this.direction === "right") {
      this.x += this.speed;
    }
  }


}



function setup() {
  createCanvas(windowWidth, windowHeight);
  Winston = new Walker(width/2, height/2);
  George = new Walker(width/3, height/3);
}

function draw() {
  Winston.display();
  George.display();
  if (keyIsDown(keysWASD[0]) === true) {
    Winston.move("up");
    George.move("up");
  }

  //A Key
  if (keyIsDown(keysWASD[1]) === true) {
    Winston.move("left");
    George.move("left");
  }

  //S Key
  if (keyIsDown(keysWASD[2]) === true) {
    Winston.move("down");
    George.move("down");
  }

  //D Key
  if (keyIsDown(keysWASD[3]) === true) {
    Winston.move("right");
    George.move("right");
  }

}




