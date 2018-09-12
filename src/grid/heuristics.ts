interface hasPosition {
  x: number;
  y: number;
}

// See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
export const heuristics = {
  manhattan: (pos0: hasPosition, pos1: hasPosition) => {
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return d1 + d2;
  },
  diagonal: (pos0: hasPosition, pos1: hasPosition) => {
    const D = 1;
    const D2 = Math.sqrt(2);
    const d1 = Math.abs(pos1.x - pos0.x);
    const d2 = Math.abs(pos1.y - pos0.y);
    return D * (d1 + d2) + (D2 - 2 * D) * Math.min(d1, d2);
  },
};
