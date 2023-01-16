import { Vec2, ones } from "./Math";
import Collection from "./Collection";
import * as rough from "roughjs";
import { Company, CompanyLifeCycle } from "./companies/Company";
import TomatoFactory from "./companies/TomatoFactory";
import { TomatoSlicingFactory } from "./companies/TomatoSlicingFactory";
import { Graph } from "./grid/Graph";
import { Market } from "./Market";

export default class Game {
  objects = new Collection<CompanyLifeCycle & Company>();
  graph: Graph = new Graph(ones(50, 50));
  step: number = 0;
  market = new Market();

  graphics: any;
  canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.graphics = rough.canvas(this.canvas);

    this.seed();

    this.canvas.addEventListener("click", (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const inspected = this.objects.find((object) => {
        return (
          object.position.x * 10 <= x &&
          x <= object.position.x * 10 + 10 &&
          object.position.y * 10 <= y &&
          y <= object.position.y * 10 + 10
        );
      });

      console.dir(inspected);
    });
  }

  seed() {
    for (let i = 0; i < 10; i++) {
      this.objects.add(new TomatoFactory(new Vec2(2 * i + 2, 2), this.market));
    }
    for (let i = 0; i < 10; i++) {
      this.objects.add(
        new TomatoSlicingFactory(new Vec2(2 * i + 2, 40), this.market)
      );
    }
  }
  
  run() {
    setInterval(() => {
      this.update();
    }, 100);
    setInterval(() => {
      this.render();
    }, 100);
  }

  update() {
    this.step++;
    for (let object of this.objects) {
      object.produce?.();
    }
    for (let object of this.objects) {
      object.makeOffers?.();
    }
    for (let object of this.objects) {
      object.buyFromMarket?.();
    }
  }

  render() {
    const context = this.canvas.getContext("2d")!;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fillRed = { fill: "red" };

    for (let object of this.objects) {
      this.graphics.rectangle(
        object.position.x * 10 + 1,
        object.position.y * 10 + 1,
        8,
        8,
        fillRed
      );
    }
  }
}
