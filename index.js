const PAD = 20;
const WIDTH = window.innerWidth - PAD * 2;
const HEIGHT = window.innerHeight - PAD * 2;
const WHITE = "rgb(255, 255, 255)";
const BLACK = "rgb(0, 0, 0)";
const RED = "rgb(200, 0, 0";
const PINK = "rgb(255, 150, 150)";
const GREEN = "rgb(3, 160, 98)";
const OLIVE = "rgb(128, 128, 0)";

const SEARCH_ORIGINS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];
const SEARCH_DIRECTIONS = [
  [1, 1],
  [-1, +1],
  [-1, -1],
  [1, -1],
];

class Cell {
  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
  }
}

class GridCell extends Cell {
  constructor(posX, posY) {
    super(posX, posY);
    this.entity = null;
  }

  getSearchOrigins(distance) {
    return SEARCH_ORIGINS.map((origin) => {
      return {
        posX: this.posX + distance * origin[0],
        posY: this.posY + distance * origin[1],
      };
    });
  }

  addAnimalToCell(animal) {
    animal.posX = this.posX;
    animal.posY = this.posY;
    this.entity = animal;
  }
}

class Grid {
  constructor(cellSize) {
    this.cellSize = cellSize;
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.height = HEIGHT;
    this.canvas.width = WIDTH;
    this.context = this.canvas.getContext("2d");
    this.cellsX = (WIDTH - (WIDTH % this.cellSize)) / this.cellSize;
    this.cellsY = (HEIGHT - (HEIGHT % this.cellSize)) / this.cellSize;
    this.cells = this.createGrid();
  }

  createGrid() {
    const cells = {};
    for (let posY = 0; posY < this.cellsY; posY++) {
      for (let posX = 0; posX < this.cellsX; posX++) {
        cells[`X${posX}Y${posY}`] = new GridCell(posX, posY);
      }
    }
    return cells;
  }

  getCellFromXY(x, y) {
    return this.cells[this.getGridLabelFromXY(x, y)];
  }

  cellIsEmpty(x, y) {
    return this.getCellFromXY(x, y).entity == null;
  }

  getGridLabelFromXY(x, y) {
    return `X${x}Y${y}`;
  }

  getRandomPosX() {
    return Math.round(Math.random() * (this.cellsX - 1));
  }

  getRandomPosY() {
    return Math.round(Math.random() * (this.cellsY - 1));
  }

  getCellsWithinSearchArea(cell, distance) {
    const cells = [];
    const origins = cell.getSearchOrigins(distance);

    for (let distanceIndex = 0; distanceIndex < distance; distanceIndex++) {
      cells.push(...this.getCellsAtDistanceFromOrigins(distanceIndex, origins));
    }

    return cells.filter((cell) => {
      return cell !== undefined;
    });
  }

  getCellsAtDistanceFromOrigins(distanceIndex, origins) {
    return origins.map((origin, directionIndex) => {
      const newPosX =
        origin.posX + distanceIndex * SEARCH_DIRECTIONS[directionIndex][0];
      const newPosY =
        origin.posY + distanceIndex * SEARCH_DIRECTIONS[directionIndex][1];

      return this.getCellFromXY(newPosX, newPosY);
    });
  }
}

class Plant extends Cell {
  constructor(posX, posY) {
    super(posX, posY);
    this.energy = Math.round(Math.random() * 10) + 10;
    this.split = false;
  }

  energyIsZero() {
    if (this.energy <= 0) {
      return true;
    } else {
      return false;
    }
  }
}

class Animal extends Cell {
  constructor(
    posX,
    posY,
    rate = Math.round(Math.random() * 2) + 1,
    range = Math.round(Math.random() * 10) + 10
  ) {
    super(posX, posY);
    this.dirX = 0;
    this.dirY = 0;
    this.name = this.getRandomNumber();
    this.energy = 10;
    this.rate = rate;
    this.range = range;
    this.target = null;
  }

  getRandomNumber() {
    return Array(4)
      .fill(1)
      .map((number) => {
        return Math.round(Math.random() * 9);
      })
      .join("");
  }

  energyIsZero() {
    if (this.energy <= 0) {
      return true;
    } else {
      return false;
    }
  }

  hasValidTarget() {
    if (
      this.target == null ||
      this.target.entity == null ||
      this.target.entity.energy <= 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  canReachTarget() {
    if (
      this.getDistanceToTarget() <= 1 ||
      (this.getDifferenceBetweenTwoNumbers(this.posX, this.target.posX) == 1 &&
        this.getDifferenceBetweenTwoNumbers(this.posY, this.target.posY) == 1)
    ) {
      return true;
    } else {
      return false;
    }
  }

  getDistanceToTarget() {
    return (
      this.getDifferenceBetweenTwoNumbers(this.posX, this.target.posX) +
      this.getDifferenceBetweenTwoNumbers(this.posY, this.target.posY)
    );
  }

  getDifferenceBetweenTwoNumbers(x, y) {
    return Math.abs(x - y);
  }

  expendsEnergy() {
    this.energy -= this.rate === 3 ? 2 : 1;
  }

  consumesPlant() {
    this.energy +=
      this.target.entity.energy < 10 ? this.target.entity.energy : 10;
  }

  clearTarget() {
    this.target = null;
  }

  getNextCellPosition() {
    this.setDirections();
    const newPosX = this.getNextPositionX();
    const newPosY = this.getNextPositionY();

    return { newPosX: newPosX, newPosY: newPosY };
  }

  setDirections() {
    this.setDirX();
    this.setDirY();
  }

  setDirX() {
    if (this.posX === this.target.posX) {
      this.dirX = 0;
    } else if (this.posX < this.target.posX) {
      this.dirX = 1;
    } else if (this.posX > this.target.posX) {
      this.dirX = -1;
    }
  }

  setDirY() {
    if (this.posY === this.target.posY) {
      this.dirY = 0;
    } else if (this.posY < this.target.posY) {
      this.dirY = 1;
    } else if (this.posY > this.target.posY) {
      this.dirY = -1;
    }
  }

  getNextPositionX() {
    const differenceInX = this.getDifferenceBetweenTwoNumbers(
      this.posX,
      this.target.posX
    );

    const newPosX = this.posX + this.getUpdatedPosX(differenceInX);
    return newPosX;
  }

  getUpdatedPosX(difference) {
    if (difference < this.rate) {
      return this.dirX * (difference - 1);
    } else if (difference == this.rate) {
      return this.dirX * (this.rate - 1);
    } else if (difference > this.rate) {
      return this.dirX * this.rate;
    }
  }

  getNextPositionY() {
    const differenceInY = this.getDifferenceBetweenTwoNumbers(
      this.posY,
      this.target.posY
    );

    const newPosY = this.posY + this.getUpdatedPosY(differenceInY);
    return newPosY;
  }

  getUpdatedPosY(difference) {
    if (difference < this.rate) {
      return this.dirY * (difference - 1);
    } else if (difference == this.rate) {
      return this.dirY * (this.rate - 1);
    } else if (difference > this.rate) {
      return this.dirY * this.rate;
    }
  }
}

class Game {
  constructor(fps, cellSize) {
    this.fps = fps;
    this.grid = new Grid(cellSize);
    this.plants = [];
    this.animals = [];
    this.plantCellsToUpdate = [];
    this.animalCellsToUpdate = [];
    this.cellsToRemove = [];
  }

  run() {
    this.setup();
    // this.renderUpdates();
    this.running = this.getGameIntervalObject();
  }

  setup() {
    this.createPlants(this.getNumberOfPlants());
    this.createAnimals(this.getNumberOfAnimals());
  }

  getNumberOfPlants() {
    return (this.grid.cellsX * this.grid.cellsY) / this.grid.cellSize ** 2;
  }

  getNumberOfAnimals() {
    return (this.grid.cellsX * this.grid.cellsY) / this.grid.cellSize ** 3;
  }

  createPlants(totalPlants) {
    for (let i = 0; i < totalPlants; i++) {
      const posX = this.grid.getRandomPosX();
      const posY = this.grid.getRandomPosY();
      this.createPlantIfCellEmpty(posX, posY);
    }
  }

  createPlantIfCellEmpty(posX, posY) {
    if (this.grid.cellIsEmpty(posX, posY)) {
      this.createPlantInCell(posX, posY);
    }
  }

  createPlantInCell(posX, posY) {
    const plant = new Plant(posX, posY);
    const gridCell = this.grid.getCellFromXY(posX, posY);

    gridCell.entity = plant;
    this.plants.push(plant);
    this.plantCellsToUpdate.push(gridCell);
  }

  createAnimals(totalAnimals) {
    for (let i = 0; i < totalAnimals; i++) {
      const posX = this.grid.getRandomPosX();
      const posY = this.grid.getRandomPosY();
      this.createAnimalIfCellEmpty(posX, posY);
    }
  }

  createAnimalIfCellEmpty(posX, posY) {
    if (this.grid.cellIsEmpty(posX, posY)) {
      this.createAnimalInCell(posX, posY);
    }
  }

  createAnimalInCell(posX, posY) {
    const animal = new Animal(posX, posY);
    const gridCell = this.grid.getCellFromXY(posX, posY);

    gridCell.entity = animal;
    this.animals.push(animal);
    this.animalCellsToUpdate.push(gridCell);
  }

  getGameIntervalObject() {
    setInterval(() => {
      try {
        this.gameLoop();
      } catch (e) {
        console.log(e);
        clearInterval(this.running);
      }
    }, 1000 / this.fps);
  }

  gameLoop() {
    this.renderUpdates();
    this.clearRenderArrays();
    this.updateAllAnimals();
    this.updateAllPlants();
  }

  renderUpdates() {
    this.grid.context.beginPath();

    this.renderClearedCells();
    this.renderUpdatedPlants();
    this.renderUpdatedAnimals();

    this.grid.context.closePath();
  }

  renderClearedCells() {
    this.cellsToRemove.forEach((cell) => {
      this.clearCell(cell);
    });
  }

  clearCell(cell) {
    this.grid.context.clearRect(
      cell.posX * this.grid.cellSize,
      cell.posY * this.grid.cellSize,
      this.grid.cellSize,
      this.grid.cellSize
    );
  }

  renderUpdatedPlants() {
    this.plantCellsToUpdate.forEach((cell) => {
      this.renderPlant(cell);
    });
  }

  renderPlant(cell) {
    this.grid.context.fillStyle = cell.entity.energy >= 10 ? GREEN : OLIVE;
    this.grid.context.fillRect(
      cell.posX * this.grid.cellSize,
      cell.posY * this.grid.cellSize,
      this.grid.cellSize,
      this.grid.cellSize
    );
  }

  renderUpdatedAnimals() {
    this.animalCellsToUpdate.forEach((cell) => {
      this.renderAnimal(cell);
    });
  }

  renderAnimal(cell) {
    this.grid.context.fillStyle =
      cell.entity.rate === 3 ? RED : cell.entity.rate === 2 ? PINK : WHITE;
    this.grid.context.fillRect(
      cell.posX * this.grid.cellSize,
      cell.posY * this.grid.cellSize,
      this.grid.cellSize,
      this.grid.cellSize
    );
  }

  clearRenderArrays() {
    this.cellsToRemove = [];
    this.plantCellsToUpdate = [];
    this.animalCellsToUpdate = [];
  }

  updateAllAnimals() {
    this.animals.forEach((animal) => {
      this.updateAnimal(animal);
    });
  }

  updateAnimal(animal) {
    if (animal.energyIsZero()) {
      this.animalDies(animal);
    } else {
      this.animalLives(animal);
    }
  }

  animalDies(animal) {
    this.clearGridCell(this.grid.getCellFromXY(animal.posX, animal.posY));
    this.removeAnimalFromArray(animal);
  }

  clearGridCell(gridCell) {
    gridCell.entity = null;
    this.cellsToRemove.push(gridCell);
  }

  removeAnimalFromArray(animal) {
    this.animals.splice(this.animals.indexOf(animal), 1);
  }

  animalLives(animal) {
    if (animal.hasValidTarget()) {
      this.animalActsOnTarget(animal);
    } else {
      this.animalFindsNewTarget(animal);
      animal.expendsEnergy();
    }
  }

  animalActsOnTarget(animal) {
    if (animal.canReachTarget()) {
      this.animalEatsTarget(animal);
    } else {
      this.animalMoves(animal);
    }
  }

  animalEatsTarget(animal) {
    if (animal.hasValidTarget()) {
      animal.consumesPlant();
      this.plantDies(animal.target.entity);
      animal.clearTarget();
    } else {
      animal.expendsEnergy();
      animal.clearTarget();
    }
  }

  plantDies(plant) {
    this.clearGridCell(this.grid.getCellFromXY(plant.posX, plant.posY));
    this.removePlantFromArray(plant);
  }

  removePlantFromArray(plant) {
    this.plants.splice(this.plants.indexOf(plant), 1);
  }

  animalMoves(animal) {
    this.calculateAnimalMove(animal);
    animal.expendsEnergy();
  }

  calculateAnimalMove(animal) {
    const nextCell = this.getNextCell(animal);

    if (this.grid.cellIsEmpty(nextCell.posX, nextCell.posY)) {
      this.animalMovesToNextCell(animal, nextCell);
    }
  }

  getNextCell(animal) {
    const { newPosX, newPosY } = animal.getNextCellPosition();
    const newCell = this.grid.getCellFromXY(newPosX, newPosY);
    return newCell;
  }

  animalMovesToNextCell(animal, nextCell) {
    const previousCell = this.grid.getCellFromXY(animal.posX, animal.posY);

    nextCell.addAnimalToCell(animal);
    this.animalCellsToUpdate.push(nextCell);

    this.clearGridCell(previousCell);
  }

  animalFindsNewTarget(animal) {
    animal.target = this.getClosestPlant(animal);
  }

  getClosestPlant(animal) {
    for (let rangeIndex = 1; rangeIndex <= animal.range; rangeIndex++) {
      const cells = this.grid.getCellsWithinSearchArea(
        this.grid.getCellFromXY(animal.posX, animal.posY),
        rangeIndex
      );

      const plants = cells.filter((cell) => {
        return cell.entity instanceof Plant;
      });

      if (plants.length === 1) {
        return plants[0];
      } else if (plants.length > 1) {
        return plants[Math.round(Math.random() * (plants.length - 1))];
      }
    }
  }

  updateAllPlants() {
    this.plants.forEach((plant) => {
      if (plant.energy >= 50) {
        plant.split = true;
      } else if (plant.energy <= 0) {
        this.plantDies(plant);
      }

      if (plant.split) {
        plant.energy -= 1;
      } else {
        plant.energy += 1;
      }
    });
  }
}

document.querySelector("body").style.padding = `${PAD}px`;
// document.addEventListener("click", () => {
//   console.log(game.plants);
// });

const game = new Game(4, 6);
game.run();
