import { Vec2, ones } from './Math';
import Collection from './Collection';
import * as rough from 'roughjs';
import { Drone } from './Drone';
import { Factory } from './factories/Factory';
import { TomatoFactory } from './factories/TomatoFactory';
import { TomatoSlicingFactory } from './factories/TomatoSlicingFactory';
import { GridNode } from './grid/GridNode';
import { Graph } from './grid/Graph';

export interface HasPosition {
  position: Vec2;
}

interface GameObject {
  update(game: Game): void;
  position: Vec2;
}

export default class Game {
  objects: Collection<GameObject>;
  graph: Graph = new Graph(ones(50, 50));
  step: number = 0;

  graphics: any;
  canvas: HTMLCanvasElement;

  constructor() {
    this.objects = new Collection();

    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.graphics = rough.canvas(this.canvas);

    this.seed();

    this.canvas.addEventListener('click', event => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const inspected = this.objects.find(object => {
        return object.position.x * 10 <= x && x <= object.position.x * 10 + 10 &&
        object.position.y * 10 <= y && y <= object.position.y * 10 + 10
      });

      console.dir(inspected);
    })
  }

  seed() {
    for (let i = 0; i < 10; i++) {
      this.objects.add(new Drone());
    }
    for (let i = 0; i < 10; i++) {
      this.objects.add(new TomatoFactory(new Vec2(2 * i + 2, 2)));
    }
    for (let i = 0; i < 10; i++) {
      this.objects.add(new TomatoSlicingFactory(new Vec2(2 * i + 2, 40)));
    }
  }

  factories(): Factory[] {
    return this.objects.filter(
      object => object instanceof Factory
    ) as Factory[];
  }

  run() {
    setInterval(() => {
      this.update();
    }, 100);
    setInterval(() => {
      this.render();
    }, 100);
  }

  update() {
    this.step++;
    for (let object of this.objects) {
      object.update(this);
    }
  }

  render() {
    const context = this.canvas.getContext('2d');

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fillGreen = { fill: 'green' };
    const fillRed = { fill: 'red' };
    const lightStroke = { stroke: 'rgba(0, 0, 0, 0.1)'}

    for (let object of this.objects) {
      this.graphics.rectangle(
        object.position.x * 10 + 1,
        object.position.y * 10 + 1,
        8,
        8,
        object instanceof Drone ? fillGreen : fillRed
      );

      if (object instanceof Drone && (object.behavior as any).path) {
        const path = (object.behavior as any).path as GridNode[];
        for (let i = 1; i < path.length; i++) {
          this.graphics.line(
            path[i - 1].x * 10 + 5,
            path[i - 1].y * 10 + 5,
            path[i].x * 10 + 5,
            path[i].y * 10 + 5,
            lightStroke
          );
        }
      }
    }
  }
}
