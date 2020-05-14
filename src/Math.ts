export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqual(other: Vec2): boolean {
    return this.x == other.x && this.y == other.y;
  }

  distSquared(other: Vec2): number {
    return (
      (this.x - other.x) * (this.x - other.x) +
      (this.y - other.y) * (this.y - other.y)
    );
  }

  copyFrom(other: Vec2): void {
    this.x = other.x;
    this.y = other.y;
  }
}

export function randomInt(min: number, max: number) {
  return min + Math.floor(Math.random() * (max - min));
}
