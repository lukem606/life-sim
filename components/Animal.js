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

module.exports = Animal;
