// const Cell = require("./components/Cell");
// const GridCell = require("./components/GridCell");
// const Grid = require("./components/Grid");
// const Plant = require("./components/Plant");
// const Animal = require("./components/Animal");

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

module.exports = Game;
