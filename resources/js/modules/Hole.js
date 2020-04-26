import Vector2d from './Vector2d';

const TEXT_OFFSET = 10;
const TEXT_SIZE = 100;
const FLASH_SPEED = 5;
const FLASH_POWER = 0.6;

export default class Hole {
  constructor(util, x, y, size, color = '#333333') {
    this.util = util;
    this.ctx = util.canvasContext;

    this.position = new Vector2d(x, y);
    this.vector = new Vector2d(0, -1.0);
    this.color = color;
    this.size = size;

    this.isReady = false;
    this.time = 0;
    this.isTouched = false;
    this.initialize();
  }

  setIsTouched(flag) {
    this.time = 0;
    this.isTouched = flag;
  }

  setPosition(x, y) {
    this.position.set(x, y);
  }

  renderDefault(deltaTime) {
    const position = this.position;

    // alphaの値を0からFLASH_POWERの範囲で振動させる
    const alpha = Math.abs(FLASH_POWER * Math.cos(this.time * FLASH_SPEED));
    this.ctx.globalAlpha = alpha;
    this.util.drawCircle(position.x, position.y, this.size, this.color);

    this.ctx.globalAlpha = 1;
    const textSize = TEXT_SIZE;
    const textX = position.x - textSize / 4;
    const textY = position.y - this.size - TEXT_OFFSET;
    this.ctx.font = 'bold 18px sans-serif';
    this.util.drawText('Hold!', textX, textY, '#111', textSize);
  }

  renderVacuum(deltaTime) {
    const position = this.position;
    this.util.drawCircle(position.x, position.y, this.size, this.color);
  }

  render(deltaTime) {
    this.time += deltaTime;

    if (this.isTouched) {
      this.renderVacuum(deltaTime);
    } else {
      this.renderDefault(deltaTime);
    }
  }

  initialize() {
    this.isReady = true;
  }
}
