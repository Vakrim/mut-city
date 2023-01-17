interface Position {
  x: number;
  y: number;
}

export function getManhattanDistance(pos0: Position, pos1: Position) {
  const d1 = Math.abs(pos1.x - pos0.x);
  const d2 = Math.abs(pos1.y - pos0.y);
  return d1 + d2;
}
