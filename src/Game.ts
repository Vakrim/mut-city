import Factory from "./Factory";
import Road from "./Road";
import { Vec2 } from "./Math";
import Collection from "./Collection";
import FindNearest from "./FindNearest";
import * as PIXI from 'pixi.js';

export interface HasPosition {
  position: Vec2
}

export default class Game {
  factories: Collection<Factory>
  roads: Collection<Road>
  boardSize = 50;
  board: Array<Array<HasPosition>>
  graphics: PIXI.Graphics

  init() {
    this.factories = new Collection();
    this.roads = new Collection();

    const mainFactory = this.createFactory(factory => {
      factory.position = new Vec2(25, 25);
    });

    this.createEmptyBoard();

    const app = new PIXI.Application(800, 600, { antialias: true });
    document.body.appendChild(app.view);

    this.graphics = new PIXI.Graphics();
    app.stage.addChild(this.graphics);

    setInterval(() => {this.update()}, 1000)
  }

  update() {
    this.updateBoard()
    const solution = new FindNearest(this.board, <Factory>this.findAt(new Vec2(25, 25))).solve();

    if(solution) {
      for(let node of solution.route) {
        if(node instanceof Factory) {
          this.destroyFactory(node);
          this.createRoad(road => {
            road.position = node.position;
          })
        }
      }
      this.createFactory(factory => {
        factory.position = solution.end.position;
      });
    }

    this.render();
  }

  render() {
    this.graphics.beginFill(0xFF3300);
    for(let factory of this.factories) {
      this.graphics.drawRect(factory.position.x * 10, factory.position.y * 10, 10, 10)
    }
    this.graphics.beginFill(0xAAAAAA);
    for(let road of this.roads) {
      this.graphics.drawRect(road.position.x * 10 + 2, road.position.y * 10, 6, 10)
      this.graphics.drawRect(road.position.x * 10, road.position.y * 10 + 2, 10, 6)
    }
    this.graphics.endFill();
  }

  findAt(position: Vec2) {
    const predicate = (el: HasPosition) => el.position.x === position.x && el.position.y === position.y;

    return this.factories.find(predicate) || this.roads.find(predicate);
  }

  createFactory(tap: (f: Factory) => void = () => {}): Factory {
    const factory = new Factory();
    tap(factory)
    return this.factories.add(factory);
  }

  createRoad(tap: (f: Road) => void = () => {}): Road {
    const road = new Road();
    tap(road)
    return this.roads.add(road);
  }

  destroyFactory(factory: Factory) {
    this.factories.delete(factory);
  }

  destroyRoad(road: Road) {
    this.roads.delete(road);
  }

  createEmptyBoard() {
    const board = new Array(this.boardSize);
    for(let x = 0; x< this.boardSize; x++) {
      board[x] = new Array(this.boardSize);
      for(let y = 0; y<this.boardSize; y++) {
        board[x][y] = { position: new Vec2(x, y), isEmpty: true };
      }
    }
    this.board = board;
  }

  updateBoard() {
    for(let factory of this.factories) {
      this.board[factory.position.x][factory.position.y] = factory;
    }
    for(let road of this.roads) {
      this.board[road.position.x][road.position.y] = road;
    }
  }
}
