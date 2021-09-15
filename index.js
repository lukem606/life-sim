const PAD = 20;
const WIDTH = window.innerWidth - PAD;
const HEIGHT = window.innerHeight - PAD;
const WHITE = "rgb(255, 255, 255)";
const BLACK = "rgb(0, 0, 0)";
const GREEN = "rgb(3, 160, 98)";
document.querySelector("body").style.padding = `${PAD}px`;

class Cell {
  constructor(index, cellsX) {
    this.posX = index % cellsX;
    this.posY = Math.floor(index / cellsX);
  }
}

class Plant extends Cell {
  constructor(index, cellsX) {
    super(index, cellsX);
    this.life = 10;
  }
}

class Creature extends Cell {
  constructor(index, cellsX) {
    super(index, cellsX);
    this.dirX = 0;
    this.dirY = 0;
    this.rate = Math.round(Math.random() * 2) + 1;
    this.life = 10;
    this.target = false;
  }

  getDistance(plant) {
    return Math.abs(this.posX - plant.posX) + Math.abs(this.posY - plant.posY);
  }

  findClosestPlant(plants) {
    return plants.reduce((previous, current) => {
      return this.getDistance(previous) <= this.getDistance(current)
        ? previous
        : current;
    });
  }

  move() {
    if (this.posX === this.target.posX) {
      this.dirX = 0;
    } else if (this.posX < this.target.posX) {
      this.dirX = 1;
    } else if (this.posX > this.target.posX) {
      this.dirX = -1;
    }

    if (this.posY === this.target.posY) {
      this.dirY = 0;
    } else if (this.posY < this.target.posY) {
      this.dirY = 1;
    } else if (this.posY > this.target.posY) {
      this.dirY = -1;
    }

    this.posX += this.dirX * this.rate;
    this.posY += this.dirY * this.rate;

    this.life -= 1;
  }

  live(plants) {
    if (!this.target) {
      this.target = this.findClosestPlant(plants);
    } else {
      this.move(this.target);
    }
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
    this.plants = [];
  }

  createPlants(totalPlants) {
    for (let i = 0; i < totalPlants; i++) {
      this.plants.push(
        new Plant(
          Math.floor(Math.random() * (this.cellsX * this.cellsY)),
          this.cellsX
        )
      );
    }
  }

  createCreatures() {
    const returnArray = [];

    for (let i = 0; i < 5; i++) {
      returnArray.push(
        new Creature(
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

  drawLife() {
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

    this.context.fillStyle = GREEN;
    this.plants.forEach((plant) => {
      this.context.fillRect(
        plant.posX * this.cellSize,
        plant.posY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });

    this.context.closePath();
  }

  timePasses() {
    this.creatures.forEach((creature) => {
      creature.live(this.plants);
    });
  }

  gameLoop() {
    this.clearCanvas();

    if (Math.random() > 0.75) {
      this.createPlants(Math.ceil(Math.random() * 4) + 1);
    }

    this.drawLife();
    this.timePasses();
  }

  run() {
    this.createPlants(10);

    setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(4, 6);
game.run();
