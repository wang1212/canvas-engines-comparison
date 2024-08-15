import Engine from './engine';
import { Canvas, Group, CanvasEvent, Rect } from '@antv/g';
import { Renderer } from '@antv/g-webgl';

class GWebGLEngine extends Engine {
  constructor() {
    super();

    const container = document.createElement('div');
    this.content.appendChild(container);
    this.app = new Canvas({
      container, // DOM 节点id
      width: 600, // 画布宽度
      height: 500, // 画布高度
      renderer: new Renderer(),
    });
    this.rects = [];
    this.root = new Group();

    this.app.addEventListener(CanvasEvent.READY, () => {
      this.app.resize(this.width, this.height);
      this.app.appendChild(this.root);
    });
  }

  onTick() {
    const rectsToRemove = [];

    for (let i = 0; i < this.count.value; i++) {
      const rect = this.rects[i];
      rect.x -= rect.speed;
      rect.el.attr('x', rect.x);
      if (rect.x + rect.size < 0) rectsToRemove.push(i);
    }

    rectsToRemove.forEach((i) => {
      this.rects[i].x = this.width + this.rects[i].size / 2;
    });

    this.meter.tick();
  }

  render() {
    this.app.removeEventListener(CanvasEvent.BEFORE_RENDER);

    while (this.root.firstChild) {
      this.root.removeChild(this.root.firstChild);
    }

    this.rects = [];

    for (let i = 0; i < this.count.value; i++) {
      const x = Math.random() * this.width;
      const y = Math.random() * this.height;
      const size = 10 + Math.random() * 40;
      const speed = 1 + Math.random();

      const rect = new Rect({
        style: {
          x,
          y,
          width: size,
          height: size,
          fill: 'white',
          stroke: 'black',
        },
      });
      this.root.appendChild(rect);
      this.rects[i] = { x, y, size, speed, el: rect };
    }

    this.app.addEventListener(
      CanvasEvent.BEFORE_RENDER,
      this.onTick.bind(this)
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const engine = new GWebGLEngine();
  engine.render();
});
