export class Vec2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  moveTowards(target: Vec2, distance: number): boolean {
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distanceToTarget = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    if (distance > distanceToTarget) {
      this.x = target.x;
      this.y = target.y;
      return true;
    } else {
      this.x += dx * distance / distanceToTarget;
      this.y += dy * distance / distanceToTarget;
      return false;
    }
  }

  isEqual(other: Vec2): boolean {
    return this.x == other.x && this.y == other.y;
  }

  static random(): Vec2 {
    return new Vec2(Math.random() * 500, Math.random() * 500);
  }

  static copyOf(origin: Vec2): Vec2 {
    return new Vec2(origin.x, origin.y);
  }
}
