import Factory from "./Factory";
import Road from "./Road";
import { Vec2 } from "./Math";
import Collection from "./Collection";
import FindNearest from "./FindNearest";

export interface HasPosition {
  position: Vec2
}

export default class Game {
  factories: Collection<Factory>
  roads: Collection<Road>
  boardSize = 50;
  board: Array<Array<HasPosition>>

  init() {
    this.factories = new Collection();
    this.roads = new Collection();

    const mainFactory = this.createFactory();
    mainFactory.position = new Vec2(25, 25);
  }

  findAt(position: Vec2) {
    const predicate = (el: HasPosition) => el.position.x === position.x && el.position.y === position.y;

    return this.factories.find(predicate) || this.roads.find(predicate);
  }

  createFactory(): Factory {
    return this.factories.add(new Factory());
  }

  createRoad(): Road {
    return this.roads.add(new Road());
  }

  createEmptyBoard() {
    const board = new Array(this.boardSize);
    for(let x = 0; x< this.boardSize; x++) {
      board[x] = new Array(this.boardSize);
      for(let y = 0; y<this.boardSize; y++) {
        board[x][y] = null;
      }
    }
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
