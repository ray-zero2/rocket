import Canvas2dUtility from './Canvas2dUtility';
import { debounse, clamp } from './utils';
import Hole from './Hole';
import Rocket from './Rocket';
// import Vector2d from './Vector2d';

const CIRCLE_SIZE = 20;
const ROCKET_NUM = 30;

export default class Index {
  constructor(selector = '.canvas') {
    this.util = new Canvas2dUtility(selector);
    if (!this.util) return;

    this.$canvas = this.util.canvasElement;
    this.ctx = this.util.canvasContext;

    // this.startTime = 0;
    this.lastTime = 0;
    this.isMouseDown = false;

    this.lastTouches = [];
    this.lastAlpha = 1;
    this.touches = [];

    this.time = 0;
    this.hole = null;
    this.rockets = [];

    this.initialize();
    this.bind();
    this.checkLoaded();
  }

  renderEffect() {
    const changeAlphaPerFrame = 0.2 / 30;
    if (this.hole.isTouched) {
      this.lastAlpha -= changeAlphaPerFrame;
    } else {
      this.lastAlpha += changeAlphaPerFrame;
    }
    this.lastAlpha = clamp(this.lastAlpha, 0.3, 1);
    this.ctx.globalAlpha = this.lastAlpha;

    this.util.drawRect(
      0,
      0,
      this.$canvas.width,
      this.$canvas.height,
      '#ffb6c1'
    );
  }

  render() {
    const now = Date.now();
    const deltaTime = (now - this.lastTime) / 1000;
    this.renderEffect();

    this.ctx.globalAlpha = 1;
    this.hole.render(deltaTime);
    this.rockets.forEach(rocket => {
      rocket.render(deltaTime);
    });

    this.lastTime = now;
    requestAnimationFrame(this.render.bind(this));
  }

  setCanvasSize(width, height) {
    this.$canvas.width = width;
    this.$canvas.height = height;
  }

  singleTouchStart() {
    const touchPosition = this.touches[0];
    const holeSize = this.hole.size;
    const holePosition = this.hole.position;
    const distance = holePosition.distance(touchPosition);

    //円のクリック判定
    if (distance < holeSize) {
      this.hole.setIsTouched(true);
    }

    this.lastTouches = this.touches;
  }

  doubleTouchStart() {}
  singleTouchMove() {
    const touchPosition = this.touches[0];
    const lastTouchPosition = this.lastTouches[0];
    const diffX = touchPosition.x - lastTouchPosition.x;
    const diffY = touchPosition.y - lastTouchPosition.y;

    this.hole.position.add({ x: diffX, y: diffY });

    this.lastTouches = this.touches;
  }
  doubleTouchMove() {}
  singleTouchEnd() {
    this.hole.setIsTouched(false);
    this.lastTouches = [];
  }
  doubleTouchEnd() {}

  touchStart() {
    const touches = this.touches;

    if (touches.length === 1) {
      this.singleTouchStart();
    } else if (touches.length === 2) {
      this.doubleTouchStart();
    }
  }

  touchMove() {
    const touches = this.touches;
    if (!this.hole.isTouched) return;

    if (touches.length === 1) {
      this.singleTouchMove();
    } else if (touches.length === 2) {
      this.doubleTouchMove();
    }
  }

  touchEnd() {
    const touches = this.touches;

    if (touches.length === 0) {
      this.singleTouchEnd();
    } else if (touches.length === 1) {
      this.doubleTouchEnd();
    }
  }

  handleResize() {
    this.setCanvasSize(window.innerWidth, window.innerHeight);
    this.hole.setPosition(window.innerWidth / 2, window.innerHeight / 2);
  }

  handleMouseDown(event) {
    this.isMouseDown = true;
    const mousePosition = { x: event.offsetX, y: event.offsetY };
    this.touches = [mousePosition];
    this.touchStart();
  }

  handleMouseMove(event) {
    if (!this.isMouseDown) return;
    const mousePosition = { x: event.offsetX, y: event.offsetY };
    this.touches = [mousePosition];
    this.touchMove();
  }

  handleMouseUp(event) {
    this.isMouseDown = false;
    this.touches = [];
    this.touchEnd();
  }

  bind() {
    window.addEventListener(
      'resize',
      debounse(() => {
        this.handleResize();
      }, 200)
    );

    this.$canvas.addEventListener('mousedown', event => {
      this.handleMouseDown(event);
    });

    this.$canvas.addEventListener('mousemove', event => {
      this.handleMouseMove(event);
    });

    document.addEventListener('mouseup', event => {
      this.handleMouseUp(event);
    });
  }

  addHole() {
    const hole = new Hole(this.util, 0, 0, CIRCLE_SIZE, '#333333');
    this.hole = hole;
  }

  addRocket(width, height, path) {
    const rocket = new Rocket(this.util, 0, 0, width, height, path);
    this.rockets.push(rocket);
  }

  addCharacters() {
    this.addHole();

    for (let i = 0; i < ROCKET_NUM; i++) {
      this.addRocket(50, 50, './images/rocket_2.png');
    }
  }

  setParams() {
    this.hole.setPosition(this.$canvas.width / 2, this.$canvas.height / 2);

    this.rockets.forEach(rocket => {
      rocket.setPosition(
        this.$canvas.width * Math.random(),
        this.$canvas.height / 2
      );
      const radian = (360 * Math.random() * Math.PI) / 180;
      // const radian = (90 * Math.PI) / 180;
      rocket.setVectorFromAngle(radian);
      rocket.setTarget(this.hole);
    });
  }

  checkLoaded() {
    let isReady = true;
    isReady = isReady && this.hole.isReady;
    this.rockets.forEach(rocket => {
      isReady = isReady && rocket.isReady;
    });

    if (isReady) {
      this.render();
    } else {
      setTimeout(this.checkLoaded.bind(this), 100);
    }
  }

  initialize() {
    this.lastTime = Date.now();
    this.setCanvasSize(window.innerWidth, window.innerHeight);
    this.addCharacters();
    this.setParams();
  }
}
