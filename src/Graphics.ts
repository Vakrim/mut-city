export interface Graphics {
  rectangle(
    x: number,
    y: number,
    width: number,
    height: number,
    style?: Style
  ): void;

  line(x1: number, x2: number, x3: number, x4: number, style?: Style): void;

  circle(x: number, y: number, diameter: number, style?: Style): void;
}

interface Style {
  fill?: string;
  fillWeight?: number;
  strokeWidth?: number;
  stroke?: string;
}
