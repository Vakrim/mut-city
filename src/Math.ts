export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqual(other: Vec2): boolean {
    return this.x === other.x && this.y === other.y;
  }

  static random(range: number): Vec2 {
    return new Vec2(
      Math.floor(Math.random() * range),
      Math.floor(Math.random() * range)
    );
  }

  static copyOf(origin: Vec2): Vec2 {
    return new Vec2(origin.x, origin.y);
  }
}

export function ones(height: number, width: number) {
  const ret: (number[])[] = [];
  for (let y = 0; y < height; y++) {
    ret[y] = [];
    for (let x = 0; x < width; x++) {
      ret[y][x] = 1;
    }
  }
  return ret;
}

export function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
