const game = new Game();
const sun = new Sun();
const cloud = new Cloud();
let score = 0;
let gameOver = false;

function preload() {}

function setup() {
  let canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  canvas.parent("canvas");
}

function draw() {
  clear();
}

function keyPressed() {
  switch (
    keyCode
    // handle all alphabet letters
    // no numbers, symbols etc.
  ) {
  }
}
