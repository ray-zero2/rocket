import Index from './modules/Index';

class App {
  constructor() {
    this.bind();
  }

  bind() {
    window.addEventListener('load', () => {
      new Index('.canvas');
    });
  }
}

new App();
