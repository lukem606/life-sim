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
    this.dirX = Math.round(Math.random() * 2) - 1;
    this.dirY = Math.round(Math.random() * 2) - 1;
    this.rate = Math.floor(Math.random() * 3) + 1;
  }
}

class Game {
  constructor(fps, cellSize) {
    this.fps = fps;
    this.cellSize = cellSize;
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.height = HEIGHT;
    this.canvas.width = WIDTH;
    this.context = this.canvas.getContext("2d");
    this.cellsX = (WIDTH - (WIDTH % this.cellSize)) / this.cellSize;
    this.cellsY = (HEIGHT - (HEIGHT % this.cellSize)) / this.cellSize;
    this.creatures = this.createCreatures();
  }

  createCreatures() {
    const returnArray = [];

    for (let i = 0; i < 5; i++) {
      returnArray.push(
        new Cell(
          Math.floor(Math.random() * (this.cellsX * this.cellsY)),
          this.cellsX
        )
      );
    }

    return returnArray;
  }

  clearCanvas() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.closePath();
  }

  drawCreatures() {
    this.context.beginPath();
    this.context.fillStyle = WHITE;

    this.creatures.forEach((creature) => {
      this.context.fillRect(
        creature.posX * this.cellSize,
        creature.posY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });

    this.context.closePath();
  }

  updateCreatures() {
    this.creatures.forEach((creature) => {
      creature.posX += creature.dirX * creature.rate;
      creature.posY += creature.dirY * creature.rate;
    });
  }

  gameLoop() {
    this.clearCanvas();
    this.drawCreatures();
    this.updateCreatures();
  }

  run() {
    console.log(this.creatures);
    setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(4, 10);
game.run();
