declare module "*.png" {
  const value: string;
  export default value;
}

declare module "simplex-noise" {
  class Noise {
    constructor(seed: string);
    noise2D(x: number, y: number): number;
  }

  export default Noise;
}