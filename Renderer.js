export default class Renderer {
  constructor(height, width) {
    this.canvas = document.getElementById("gameCanvas");
    this.canvas.height = height;
    this.canvas.width = width;
    this.context = this.canvas.getContext("2d");
  }
}
