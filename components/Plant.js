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

module.exports = Plant;
