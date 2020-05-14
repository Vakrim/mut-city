import tileset from "./tileset.png";
import SimplexNoise from "simplex-noise";

export class Graphics {
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width = 800;
  height = 600;
  tileset: HTMLImageElement;
  floor: OffscreenCanvas;
  floorCtx: OffscreenCanvasRenderingContext2D;

  tilesetLocations = {
    drone1: [2, 9],
    drone2: [3, 9],
    resource: [7, 8]
  };

  constructor() {
    this.canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvasElement.width = this.width;
    this.canvasElement.height = this.height;
    this.ctx = this.canvasElement.getContext("2d");
    this.tileset = new Image();
    this.tileset.src = tileset;

    this.generateFloor();

    this.resizeCanvas();
  }

  private generateFloor() {
    this.floor = new OffscreenCanvas(
      floorSize * tileSize,
      floorSize * tileSize
    );
    this.floorCtx = this.floor.getContext("2d");
    this.floorCtx.fillStyle = "#171514";
    this.ctx.fillRect(0, 0, this.floor.width, this.floor.height);

    this.tileset.onload = () => {
      for (let x = 0; x < floorSize; x++) {
        for (let y = 0; y < floorSize; y++) {
          const tile = getFloorTile(x, y);

          this.floorCtx.drawImage(
            this.tileset,
            tile[0] * tileSize,
            tile[1] * tileSize,
            tileSize,
            tileSize,
            x * tileSize,
            y * tileSize,
            tileSize,
            tileSize
          );
        }
      }
    };
  }

  resizeCanvas() {
    window.addEventListener("resize", () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.canvasElement.width = this.width;
      this.canvasElement.height = this.height;
    });
  }

  clear(): void {
    this.ctx.fillStyle = "#171514";

    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let x = 0; x < this.width; x += this.floor.width) {
      for (let y = 0; y < this.height; y += this.floor.height) {
        this.ctx.drawImage(this.floor, x, y);
      }
    }
  }

  fillStyle(color: string): void {
    this.ctx.fillStyle = color;
  }

  drawRect(x: number, y: number, width: number, height: number): void {
    this.ctx.fillRect(x, y, width, height);
  }

  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x1 * tileSize + tileSize / 2, y1 * tileSize + tileSize / 2);
    this.ctx.lineTo(x2 * tileSize + tileSize / 2, y2 * tileSize + tileSize / 2);
    this.ctx.stroke();
  }

  drawSprite(x: number, y: number, spriteLocation: number[]) {
    this.ctx.drawImage(
      this.tileset,
      spriteLocation[0] * tileSize,
      spriteLocation[1] * tileSize,
      tileSize,
      tileSize,
      x * tileSize,
      y * tileSize,
      tileSize,
      tileSize
    );
  }
}

const tileSize = 32;

const floorSize = 15;

const floorTiles = {
  normal: [1, 3],
  light1: [2, 10],
  light2: [3, 10],
  pinki: [6, 10],
  crossed1: [0, 11],
  crossed2: [1, 11]
};

const lightNoise = new SimplexNoise("light");
const lightNoiseDensity = 8;

const pinkiNoise = new SimplexNoise("pinki");
const pinkiNoiseDensity = 3;

const crossedNoise = new SimplexNoise("crossed");
const crossedNoiseDensity = 8;

const pattern = 0.7;

function getFloorTile(x: number, y: number) {
  const lightNoiseValue = lightNoise.noise2D(
    x / lightNoiseDensity,
    y / lightNoiseDensity
  );

  if (lightNoiseValue > pattern * 0.75) {
    return floorTiles.light1;
  }

  if (lightNoiseValue > pattern * 0.65) {
    return floorTiles.light2;
  }

  const pinkiNoiseValue = pinkiNoise.noise2D(
    x / pinkiNoiseDensity,
    y / pinkiNoiseDensity
  );

  if (pinkiNoiseValue > pattern * 0.75) {
    return floorTiles.pinki;
  }

  const crossedNoiseValue = crossedNoise.noise2D(
    x / crossedNoiseDensity,
    y / crossedNoiseDensity
  );

  if (crossedNoiseValue > pattern * 0.75) {
    return floorTiles.crossed1;
  }

  if (crossedNoiseValue > pattern * 0.55) {
    return floorTiles.crossed2;
  }

  return floorTiles.normal;
}
