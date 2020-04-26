/**
 * Vector2d
 */

export default class Vector2d {
  static calcLength(x, y) {
    return Math.hypot(x, y);
  }

  static normalized(x, y) {
    const length = Vector2d.calcLength(x, y);
    return new Vector2d(x / length, y / length);
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  set(x, y) {
    if (x !== null) this.x = x;
    if (y !== null) this.y = y;
  }

  add(vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  subtract(vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  multiply(value) {
    this.x *= value;
    this.y *= value;
  }

  divide(value) {
    this.x /= value;
    this.y /= value;
  }

  normalize() {
    const length = Math.hypot(this.x, this.y);
    if (length === 0) {
      this.x = 0;
      this.y = 0;
    } else {
      this.divide(length);
    }
  }

  distance(targetVector) {
    const x = this.x - targetVector.x;
    const y = this.y - targetVector.y;
    return Math.hypot(x, y);
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  calcMatrix2D(matrix, baseMatrix = [this.x, this.y]) {
    const baseX = baseMatrix[0];
    const baseY = baseMatrix[1];

    const calcX = baseX * matrix[0][0] + baseY * matrix[0][1];
    const calcY = baseX * matrix[1][0] + baseY * matrix[1][1];
    return { x: calcX, y: calcY };
  }

  rotate(radian) {
    const sin = Math.sin(radian);
    const cos = Math.cos(radian);
    const rotateMat2D = [
      [cos, -sin],
      [sin, cos]
    ];
    const calculatedMatrix = this.calcMatrix2D(rotateMat2D);
    this.x = calculatedMatrix.x;
    this.y = calculatedMatrix.y;
  }

  dot(targetVector) {
    return this.x * targetVector.x + this.y * targetVector.y;
  }

  cross(targetVector) {
    return this.x * targetVector.y - this.y * targetVector.x;
  }
}
