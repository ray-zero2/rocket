export default class Canvas2dUtility {
  constructor(selector = '.canvas') {
    this.$canvas = document.querySelector(selector);
    if (!this.$canvas) return;
    this.context2d = this.$canvas.getContext('2d');
  }

  get canvasElement() {
    return this.$canvas;
  }

  get canvasContext() {
    return this.context2d;
  }

  drawCircle(x, y, radius, color = '#333333') {
    this.context2d.fillStyle = color;
    this.context2d.beginPath();
    this.context2d.arc(x, y, radius, 0.0, Math.PI * 2.0);
    this.context2d.closePath();
    this.context2d.fill();
  }

  drawRect(x, y, width, height, color = '#eeeeee') {
    this.context2d.fillStyle = color;
    this.context2d.fillRect(x, y, width, height);
  }

  drawText(text, x, y, color, width) {
    if (color != null) this.context2d.fillStyle = color;
    this.context2d.fillText(text, x, y, width);
  }
}
