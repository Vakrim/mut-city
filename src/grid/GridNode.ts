export class GridNode {
  x: number;
  y: number;
  weight: number;
  f = 0;
  g = 0;
  h = 0;
  visited = false;
  closed = false;
  parent: GridNode | null = null;

  constructor(x: number, y: number, weight: number) {
    this.x = x;
    this.y = y;
    this.weight = weight;
  }

  toString() {
    return '[' + this.x + ' ' + this.y + ']';
  }

  getCost(fromNeighbor: GridNode) {
    // Take diagonal weight into consideration.
    if (fromNeighbor && fromNeighbor.x != this.x && fromNeighbor.y != this.y) {
      return this.weight * 1.41421;
    }
    return this.weight;
  }

  isWall() {
    return this.weight === 0;
  }
}
