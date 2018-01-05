import { Vec2 } from "./Math";
import { HasPosition } from './Game';

type Grid = Array<Array<HasPosition>>;

export default class FindNearest {
  grid: Grid;
  visited: HasPosition[];

  constructor(grid: Grid, start: HasPosition) {
    this.grid = grid;
    this.visited = [start];
  }

  solve() {

  }
}
