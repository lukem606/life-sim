const PAD = 20;
const WIDTH = window.innerWidth - PAD;
const HEIGHT = window.innerHeight - PAD;
const WHITE = "rgb(255, 255, 255)";
const BLACK = "rgb(0, 0, 0)";
document.querySelector("body").style.padding = `${PAD}px`;

class Cell {
  constructor(index, cellsX) {
    this.posX = index % cellsX;
    this.posY = Math.floor(index / cellsX);
  }
}

class Game {
  constructor(fps, cellSize, rounds) {
    this.fps = fps;
    this.cellSize = cellSize;
    this.rounds = rounds;
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.height = HEIGHT;
    this.canvas.width = WIDTH;
    this.context = this.canvas.getContext("2d");
    this.cellsX = (WIDTH - (WIDTH % this.cellSize)) / this.cellSize;
    this.cellsY = (HEIGHT - (HEIGHT % this.cellSize)) / this.cellSize;
    this.cells = this.createCells();
  }

  createCells() {
    const returnArray = [];
    for (let i = 0; i < this.cellsX * this.cellsY; i++) {
      returnArray.push(new Cell(i, this.cellsX, this.cellsY));
    }
  }

  clearCanvas() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.closePath();
  }

  drawSquare() {
    const posX = Math.floor(Math.random() * this.cellsX);

    const posY = Math.floor(Math.random() * this.cellsY);

    this.context.beginPath();
    this.context.fillStyle = WHITE;
    this.context.fillRect(
      posX * this.cellSize,
      posY * this.cellSize,
      this.cellSize,
      this.cellSize
    );
    this.context.closePath();
  }

  run() {
    setInterval(() => {
      this.clearCanvas();
      this.drawSquare();
    }, 1000 / this.fps);
  }
}

const game = new Game(4, 20, 4);
game.run();
