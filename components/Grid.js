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

module.exports = Grid;
