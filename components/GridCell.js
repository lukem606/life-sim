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

module.exports = GridCell;
