import { Vec2 } from "./Math";
import { HasPosition } from './Game';
import { minBy, pull } from 'lodash';

type Grid = Array<Array<HasPosition>>;
type EmptyCell= HasPosition & {isEmpty: boolean}

export default class FindNearest {
  grid: Grid;

  visited: HasPosition[];
  cost: Map<HasPosition, number> = new Map();
  cameFrom: Map<HasPosition, HasPosition> = new Map();
  openSet: HasPosition[];
  start: HasPosition;

  constructor(grid: Grid, start: HasPosition) {
    this.grid = grid;
    this.start = start;
    this.visited = [start];
    this.cost.set(start, 0)
    this.openSet = [];
    this.addNeighbourhood(start);
  }

  solve() {
    const endNode = this.calculateEndNode();
    if(!endNode) {
      return null;
    }
    return this.getPathFromStart(endNode);
  }

  private getPathFromStart(endNode: HasPosition) {
    const path = [];
    let lastNode = endNode;
    while(lastNode) {
      path.push(lastNode);
      lastNode = <HasPosition>this.cameFrom.get(lastNode);
    }
    return new FindNearestSolution(path.reverse());
  }

  private calculateEndNode() {
    while(true) {
      const node = minBy(this.openSet, (n: HasPosition) => this.cost.get(n));
      if(!node) {
        return null;
      }
      pull(this.openSet, node)
      if((<EmptyCell>node).isEmpty) {
        return node;
      }
      this.visited.push(node);
      this.addNeighbourhood(node);
    }
  }

  private addNeighbourhood(node: HasPosition) {
    const { position: {x, y} } = node;
    [
      this.grid[x][y-1],
      this.grid[x+1][y],
      this.grid[x][y+1],
      this.grid[x-1][y],
    ].forEach(neighbour => {
      if(!this.visited.includes(neighbour) && !this.openSet.includes(neighbour)) {
        this.cost.set(neighbour, <number>this.cost.get(node) + 1)
        this.cameFrom.set(neighbour, node)
        this.openSet.push(neighbour)
      }
    })
  }
}

class FindNearestSolution {
  path: HasPosition[];
  start: HasPosition;
  end: HasPosition;
  route: HasPosition[];

  constructor(path: HasPosition[]) {
    this.path = path;
    const route = [...path];
    this.start = <HasPosition>route.shift();
    this.end = <HasPosition>route.pop();
    this.route = route;
  }
}
