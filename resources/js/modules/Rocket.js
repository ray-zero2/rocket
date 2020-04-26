import Vector2d from './Vector2d';
import { loadImage } from './utils';

export default class Rocket {
  constructor(util, x, y, width, height, imagePath) {
    this.util = util;
    this.ctx = util.canvasContext;

    this.image = null;
    this.position = new Vector2d(x, y);
    this.vector = new Vector2d(0, -1.0);
    this.width = width;
    this.height = height;

    this.isReady = false;
    this.angle = 0;
    this.speed = 5;
    this.time = 0;
    this.target = null;
    this.initialize(imagePath);
  }

  setPosition(x, y) {
    this.position.set(x, y);
  }

  setVector(x, y) {
    this.vector.set(x, y);
    this.vector.normalize();
  }

  setAngle(angle) {
    this.angle = angle;
  }

  setTarget(target) {
    this.target = target;
  }

  setVectorFromAngle(angle) {
    this.angle = angle;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    this.setVector(x, y);
  }

  draw() {
    const position = this.position;
    const width = this.width;
    const height = this.height;
    this.ctx.save();
    this.ctx.translate(position.x, position.y);
    const defaultAngle = (270 * Math.PI) / 180;
    this.ctx.rotate(this.angle - defaultAngle);
    this.ctx.drawImage(this.image, -width / 2, -height / 2, width, height);
    this.ctx.restore();
  }

  render(deltaTime) {
    this.time += deltaTime;
    const position = this.position;
    const target = this.target;
    const width = this.width;
    const height = this.height;

    //co
    if (target.isTouched) {
      this.vector.normalize();
      const toTargetVector = Vector2d.normalized(
        target.position.x - position.x,
        target.position.y - position.y
      );
      const crossValue = this.vector.cross(toTargetVector);
      const dotValue = this.vector.dot(toTargetVector);

      // const rotatePerFrame = (5 * Math.PI) / 180;
      const radian = Math.acos(dotValue);
      const rotatePerFrame = radian / 45;
      if (crossValue > 0) {
        // 90degreeに近づける
        if (dotValue > 0) this.vector.rotate(-rotatePerFrame);
        if (dotValue < 0) this.vector.rotate(rotatePerFrame);
      } else if (crossValue < 0) {
        // 270degreeに近づける
        if (dotValue > 0) this.vector.rotate(rotatePerFrame);
        if (dotValue < 0) this.vector.rotate(-rotatePerFrame);
      }
    }

    const translateX = this.vector.x * this.speed;
    const translateY = this.vector.y * this.speed;
    position.add({ x: translateX, y: translateY });
    this.angle = Math.atan2(this.vector.y, this.vector.x);

    //reset
    if (position.x < -this.width) {
      position.set(this.ctx.canvas.width + this.width, this.height / 2);
      const radian = (360 * Math.random() * Math.PI) / 180;
      this.setVectorFromAngle(radian);
    } else if (this.ctx.canvas.width + this.width < position.x) {
      position.set(-this.width, this.height / 2);
      const radian = (360 * Math.random() * Math.PI) / 180;
      this.setVectorFromAngle(radian);
    } else if (position.y < -this.height) {
      position.set(
        this.ctx.canvas.width / 2,
        this.ctx.canvas.height + this.height
      );
      const radian = (360 * Math.random() * Math.PI) / 180;
      this.setVectorFromAngle(radian);
    } else if (this.ctx.canvas.height + this.height < position.y) {
      position.set(this.ctx.canvas.width / 2, -this.height);
      const radian = (360 * Math.random() * Math.PI) / 180;
      this.setVectorFromAngle(radian);
    }

    this.draw();
  }

  initialize(path) {
    loadImage(path).then(image => {
      this.image = image;
      this.isReady = true;
    });
  }
}
