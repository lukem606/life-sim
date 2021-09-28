const PAD = 20;
const WIDTH = window.innerWidth - PAD;
const HEIGHT = window.innerHeight - PAD;
const WHITE = "rgb(255, 255, 255)";
const BLACK = "rgb(0, 0, 0)";
const RED = "rgb(200, 0, 0";
const PINK = "rgb(255, 150, 150)";
const GREEN = "rgb(3, 160, 98)";
const OLIVE = "rgb(128, 128, 0)";
document.querySelector("body").style.padding = `${PAD}px`;

class Cell {
  constructor(index, cellsX) {
    this.index = index;
    this.posX = index % cellsX;
    this.posY = Math.floor(index / cellsX);
  }
}

class Plant extends Cell {
  constructor(index, cellsX) {
    super(index, cellsX);
    this.life = 10;
    this.split = false;
  }

  live() {
    if (this.split) {
      this.life -= 1;
    } else {
      this.life += 1;
    }
  }
}

class Animal extends Cell {
  constructor(index, cellsX, rate = Math.round(Math.random() * 2) + 1) {
    super(index, cellsX);
    this.cellsX = cellsX;
    this.dirX = 0;
    this.dirY = 0;
    this.rate = rate;
    this.life = 20;
    this.age = 0;
  }

  getDifference(self, other) {
    return Math.abs(self - other);
  }

  getDistance(plant) {
    return (
      this.getDifference(this.posX, plant.posX) +
      this.getDifference(this.posY, plant.posY)
    );
  }

  findClosestPlant(plants) {
    if (plants.length >= 1) {
      return plants.reduce((previous, current) => {
        return this.getDistance(previous) <= this.getDistance(current)
          ? previous
          : current;
      });
    } else {
      return null;
    }
  }

  move() {
    const xDif = this.getDifference(this.posX, this.target.posX);
    const yDif = this.getDifference(this.posY, this.target.posY);

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

    if (xDif < this.rate) {
      this.posX += this.dirX * (xDif - 1);
    } else if (xDif == this.rate) {
      this.posX += this.dirX * (this.rate - 1);
    } else if (xDif > this.rate) {
      this.posX += this.dirX * this.rate;
    }

    if (yDif < this.rate) {
      this.posY += this.dirY * (yDif - 1);
    } else if (yDif == this.rate) {
      this.posY += this.dirY * (this.rate - 1);
    } else if (yDif > this.rate) {
      this.posY += this.dirY * this.rate;
    }

    this.index = this.posY * this.cellsX + this.posX;
    this.life -= this.rate == 2 ? 2 : 1;
  }

  eat(plant) {
    if (plant.life >= 1) {
      this.life += plant.life < 10 ? plant.life : 10;
      plant.life = 0;
    } else {
      this.life -= this.rate == 2 ? 2 : 1;
    }
  }

  live(plants) {
    this.target = this.findClosestPlant(plants);

    if (this.target != null) {
      if (
        this.getDistance(this.target) <= 1 ||
        (this.getDifference(this.posX, this.target.posX) == 1 &&
          this.getDifference(this.posX, this.target.posX) == 1) ||
        (this.getDifference(this.posX, this.target.posX) == 1 &&
          this.getDifference(this.posX, this.target.posX) == 1)
      ) {
        this.eat(this.target);
      } else {
        this.move();
      }
    }

    this.age += 1;
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
    this.animals = this.createAnimals(10);
    this.plants = [];
  }

  clearCanvas() {
    this.context.beginPath();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.closePath();
  }

  checkCellIsEmpty(index) {
    return (
      this.plants.every((plant) => {
        return plant.index !== index;
      }) &&
      this.animals.every((animal) => {
        return animal.index !== index;
      })
    );
  }

  drawLife() {
    this.context.beginPath();

    this.plants.forEach((plant) => {
      this.context.fillStyle = plant.life >= 10 ? GREEN : OLIVE;
      this.context.fillRect(
        plant.posX * this.cellSize,
        plant.posY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });

    this.animals.forEach((animal) => {
      this.context.fillStyle =
        animal.rate == 1 ? WHITE : animal.rate == 2 ? PINK : RED;
      this.context.fillRect(
        animal.posX * this.cellSize,
        animal.posY * this.cellSize,
        this.cellSize,
        this.cellSize
      );
    });

    this.context.closePath();
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

  createAnimals(totalAnimals) {
    const returnArray = [];

    for (let i = 0; i < totalAnimals; i++) {
      returnArray.push(
        new Animal(
          Math.floor(Math.random() * (this.cellsX * this.cellsY)),
          this.cellsX
        )
      );
    }

    return returnArray;
  }

  animalBirth(animal) {
    let childX, childY;
    const dir = Math.round(Math.random() * 3);

    if (dir === 0) {
      childX = animal.posX;
      childY = animal.posY - 1;
    } else if (dir === 1) {
      childX = animal.posX + 1;
      childY = animal.posY;
    } else if (dir === 2) {
      childX = animal.posX;
      childY = animal.posY + 1;
    } else if (dir === 3) {
      childX = animal.posX - 1;
      childY = animal.posY;
    }

    const childIndex = childY * this.cellsX + childX;

    this.animals.push(new Animal(childIndex, this.cellsX, animal.rate));
    animal.life = 20;
  }

  animalDeath(animal) {
    this.animals.splice(this.animals.indexOf(animal), 1);
  }

  plantBirth(plant) {
    let childX, childY;
    const dir = Math.round(Math.random() * 3);

    if (dir === 0) {
      childX = plant.posX;
      childY = plant.posY - 1;
    } else if (dir === 1) {
      childX = plant.posX + 1;
      childY = plant.posY;
    } else if (dir === 2) {
      childX = plant.posX;
      childY = plant.posY + 1;
    } else if (dir === 3) {
      childX = plant.posX - 1;
      childY = plant.posY;
    }

    const childIndex = childY * this.cellsX + childX;

    if (this.checkCellIsEmpty(childIndex)) {
      this.plants.push(new Plant(childIndex, this.cellsX));
    }

    if (plant.life >= 50) {
      plant.split = true;
    }
  }

  plantDeath(plant) {
    this.plants.splice(this.plants.indexOf(plant), 1);
  }

  timePasses() {
    this.animals.forEach((animal) => {
      animal.live(this.plants, this.animals, this.checkCellIsEmpty);

      if (animal.life === 0 || animal.age >= 200) {
        this.animalDeath(animal);
      } else if (animal.life >= 50) {
        this.animalBirth(animal);
      }
    });

    this.plants.forEach((plant) => {
      if (plant.life <= 0) {
        this.plantDeath(plant);
      } else if (plant.life % 20 === 0) {
        this.plantBirth(plant);
      }

      plant.live();
    });
  }

  gameLoop() {
    this.clearCanvas();

    if (Math.random() > 2) {
      this.createPlants(
        Math.round((this.cellsX * this.cellsY) / this.cellSize ** 5)
      );
    }

    this.drawLife();
    this.timePasses();
  }

  run() {
    this.createPlants(
      Math.round((this.cellsX * this.cellsY) / this.cellSize ** 3)
    );

    setInterval(() => {
      this.gameLoop();
    }, 1000 / this.fps);
  }
}

const game = new Game(6, 6);
game.run();
