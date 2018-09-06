import { Vec2 } from './Math';
import Collection from './Collection';
import Resource, { ResourceType } from './Resource';
import { toPairs, minBy, every } from 'lodash';
import * as rough from 'roughjs';
import { Drone } from './Drone';

export interface HasPosition {
  position: Vec2;
}

export default class Game {
  drones: Collection<Drone>;
  resources: Collection<Resource>;
  graphics: any;
  canvas: HTMLCanvasElement;

  constructor() {
    this.drones = new Collection();
    this.resources = new Collection();

    const canvas = document.getElementById('canvas');
    if (!canvas) {
      throw new Error('No canvas element found!');
    }
    this.canvas = <HTMLCanvasElement>canvas;
    this.graphics = rough.canvas(this.canvas);

    this.seed();
  }

  seed() {
    for (let i = 0; i < 50; i++) {
      this.drones.add(new Drone());
    }
    for (let i = 0; i < 50; i++) {
      this.resources.add(new Resource({ type: ResourceType.Stick }));
    }
  }

  run() {
    setInterval(() => {
      this.update();
    }, 300);
    setInterval(() => {
      this.render();
    }, 100);
  }

  update() {
    for (let drone of this.drones) {
      drone.update(this);
    }
  }

  render() {
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('No context!');
    }

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fillRed = { fill: 'red' };
    const fillGreen = { fill: 'green' };

    for (let drone of this.drones) {
      this.graphics.rectangle(
        drone.position.x - 5,
        drone.position.y - 5,
        10,
        10,
        fillRed
      );
    }

    for (let Resource of this.resources) {
      this.graphics.rectangle(
        Resource.position.x - 5,
        Resource.position.y - 5,
        10,
        10,
        fillGreen
      );
    }
  }
}
