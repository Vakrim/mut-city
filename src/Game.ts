import Factory, { FactoryParams } from './Factory';
import Road, { RoadParams } from './Road';
import { Vec2 } from './Math';
import Collection from './Collection';
import FindNearest from './FindNearest';
import Resource, { ResourceType } from './Resource';
import { toPairs, minBy, every } from 'lodash';
import { ResourcePath } from './Path';
import * as rough from 'roughjs';

export interface HasPosition {
  position: Vec2;
}

export default class Game {
  factories: Collection<Factory>;
  roads: Collection<Road>;
  boardSize = 50;
  board: Array<Array<HasPosition>>;
  resourcePaths: ResourcePath[] = [];
  graphics: any;
  canvas: HTMLCanvasElement;

  constructor() {
    this.factories = new Collection();
    this.roads = new Collection();

    const mainFactory = this.createFactory({
      position: new Vec2(25, 25),
      requires: [new Resource(2, 'Log')],
      provides: new Resource(1, 'Point'),
    });

    this.board = this.generateEmptyBoard();

    const canvas = document.getElementById('canvas');
    if (!canvas) {
      throw new Error('No canvas element found!');
    }
    this.canvas = <HTMLCanvasElement>canvas;
    this.graphics = rough.canvas(this.canvas);
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
    const factoryWithBalance = this.findFactoryWithoutRequiresMeet();
    if (factoryWithBalance) {
      this.updateBoard();
      const solution = new FindNearest(
        this.board,
        factoryWithBalance.factory
      ).solve();

      if (solution) {
        for (let node of solution.route) {
          if (node instanceof Factory) {
            this.destroyFactory(node);
            this.createRoad({ position: node.position });
          }
        }
        // this.resourcePaths.push({

        // })
        this.createFactory({
          position: solution.end.position,
          requires: [],
          provides: new Resource(1, factoryWithBalance.resourceName),
        });
      }
    }
  }

  findFactoryWithoutRequiresMeet() {
    for (let factory of this.factories) {
      const balance: { [resourceName: string]: number } = {};
      factory.requires.forEach(resource => {
        balance[resource.type] = balance[resource.type] || 0;
        balance[resource.type] -= resource.amount;
      });
      this.resourcePaths
        .filter(path => path.end === factory)
        .forEach(resourcePath => {
          const resource = resourcePath.resource;
          balance[resource.type] += resource.amount;
        });

      for (let resourceName in balance) {
        if (balance[resourceName] < 0) {
          return {
            factory,
            resourceName: <ResourceType>resourceName,
            amount: -balance[resourceName],
          };
        }
      }
    }
    return null;
  }

  render() {
    const context = this.canvas.getContext('2d');
    if (!context) {
      throw new Error('No context!');
    }
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let factory of this.factories) {
      this.graphics.rectangle(
        factory.position.x * 10,
        factory.position.y * 10,
        10,
        10,
        { fill: 'red' }
      );
    }
    for (let road of this.roads) {
      this.graphics.line(
        road.position.x * 10 + 5,
        road.position.y * 10,
        road.position.x * 10 + 5,
        road.position.y * 10 + 10
      );
      this.graphics.line(
        road.position.x * 10,
        road.position.y * 10 + 5,
        road.position.x * 10 + 10,
        road.position.y * 10 + 5
      );
    }
  }

  findAt(position: Vec2) {
    const predicate = (el: HasPosition) =>
      el.position.x === position.x && el.position.y === position.y;

    return this.factories.find(predicate) || this.roads.find(predicate);
  }

  createFactory(params: FactoryParams): Factory {
    const factory = new Factory(params);
    return this.factories.add(factory);
  }

  createRoad(params: RoadParams): Road {
    const road = new Road(params);
    return this.roads.add(road);
  }

  destroyFactory(factory: Factory) {
    this.factories.delete(factory);
  }

  destroyRoad(road: Road) {
    this.roads.delete(road);
  }

  generateEmptyBoard() {
    const board = new Array(this.boardSize);
    for (let x = 0; x < this.boardSize; x++) {
      board[x] = new Array(this.boardSize);
      for (let y = 0; y < this.boardSize; y++) {
        board[x][y] = { position: new Vec2(x, y), isEmpty: true };
      }
    }
    return board;
  }

  updateBoard() {
    for (let factory of this.factories) {
      this.board[factory.position.x][factory.position.y] = factory;
    }
    for (let road of this.roads) {
      this.board[road.position.x][road.position.y] = road;
    }
  }
}
