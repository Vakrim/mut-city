import { Path } from "./Path";
import { Board, Field, isEmptyField } from "./Board";

export default class FindNearest {
  board: Board;

  visited: Set<Field>;
  cost: Map<Field, number> = new Map();
  cameFrom: Map<Field, Field> = new Map();
  openSet: Set<Field>;
  start: Field;
  end: Field;

  constructor(board: Board, start: Field, end: Field) {
    this.board = board;
    this.start = start;
    this.end = end;
    this.visited = new Set([start]);
    this.cost.set(start, 0);
    this.openSet = new Set();
    this.addNeighbourhood(start);
  }

  solve() {
    const endField = this.calculateEndNode();
    if (!endField) {
      return null;
    }
    return this.getPathFromStart(endField);
  }

  private getPathFromStart(endField: Field) {
    const path = [];
    let lastField = endField;
    while (lastField) {
      path.push(lastField);
      lastField = this.cameFrom.get(lastField);
    }
    return new Path(path.reverse());
  }

  private calculateEndNode() {
    while (true) {
      const field = minBy(this.openSet, (n: Field) => this.cost.get(n));
      if (!field) {
        return null;
      }
      this.openSet.delete(field);
      if (field === this.end) {
        return field;
      }
      this.visited.add(field);
      this.addNeighbourhood(field);
    }
  }

  private addNeighbourhood(field: Field) {
    const { x, y } = this.board.getFieldPosition(field);

    this.addNeighbour(field, this.board.getField(x, y - 1));
    this.addNeighbour(field, this.board.getField(x + 1, y));
    this.addNeighbour(field, this.board.getField(x, y + 1));
    this.addNeighbour(field, this.board.getField(x - 1, y));
  }

  private addNeighbour(from: Field, neighbour: Field) {
    if (!neighbour || this.visited.has(neighbour) || this.openSet.has(neighbour)) {
      return;
    }

    this.cost.set(neighbour, this.cost.get(from) + neighbour.pathCost);
    this.cameFrom.set(neighbour, from);
    this.openSet.add(neighbour);
  }
}

function minBy<T>(set: Set<T>, predicate: (item: T) => number) {
  let score = Infinity;
  let result = null;
  for (let item of set) {
    const itemScore = predicate(item);
    if (itemScore < score) {
      score = itemScore;
      result = item;
    }
  }
  return result;
}
