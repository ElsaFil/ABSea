let sunImage = "";
let cloudImage = "";

let sunPositionX = CANVAS_WIDTH - 200;
let positionY = 0;
let cloudPositionX = 0;
let cloudVelocity = 0;

function preload() {
  sunImage = loadImage("assets/sun.png");
  cloudImage = loadImage("assets/cloud.png");
}

function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  let DOMcanvas = document.querySelector(".canvas");
  canvas.parent(DOMcanvas);
}

function draw() {
  clear();
  //   background("pink");
  image(sunImage, sunPositionX, positionY, 200, 200);

  cloudPositionX += cloudVelocity;
  image(cloudImage, cloudPositionX, positionY, 420, 200);

  // check if cloud reached the other side
  if (cloudPositionX + 420 >= CANVAS_WIDTH) {
    // make sure game is not yet lost or won
    if (gameStatus === "playing") {
      showGameOver();
    }
    noLoop();
  }
}
