import { Vec2, ones, randomFromArray } from "./Math";
import * as rough from "roughjs";
import { Company } from "./companies/Company";
import { Factory } from "./companies/Factory";
import { Graph } from "./grid/Graph";
import { Market } from "./Market";
import { recipes } from "./recipes";
import { GameObjectCollection } from "./GameObjectsCollection";
import { Log } from "./Log";
import { Graphics } from "./Graphics";

export default class Game {
  objects = new GameObjectCollection();
  gridSize = 50;
  graph: Graph = new Graph(ones(this.gridSize, this.gridSize));
  step: number = 0;
  market = new Market();
  log: Log = [];

  graphics: Graphics;
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
    for (let i = 0; i < 50; i++) {
      this.createRandomFactory();
    }
  }

  createRandomFactory() {
    const position = Vec2.random(this.gridSize);

    if (!this.objects.isEmptySpace(position)) {
      return;
    }

    this.objects.add(
      new Factory(position, randomFromArray(recipes), this.market, this.log)
    );
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
    this.market.clear();

    const removeCompany = (company: Company) => {
      this.objects.delete(company);
    };

    if (this.objects.size() < 500) {
      this.createRandomFactory();
    }

    for (let object of this.objects) {
      object.startDay();
    }
    for (let object of this.objects) {
      object.produce?.();
    }
    for (let object of this.objects) {
      object.makeOffers?.();
    }
    for (let object of this.objects) {
      object.buyFromMarket?.();
    }
    for (let object of this.objects) {
      object.finishDay(removeCompany);
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

    for (let entry of this.log) {
      if (entry.type === "transaction") {
        this.graphics.line(
          entry.seller.position.x * 10 + 5,
          entry.seller.position.y * 10 + 5,
          entry.buyer.position.x * 10 + 5,
          entry.buyer.position.y * 10 + 5
        );
      } else if (entry.type === "produced") {
        this.graphics.circle(
          entry.company.position.x * 10 + 5,
          entry.company.position.y * 10 + 5,
          20,
          { stroke: "blue" }
        );
      }
    }

    this.log.length = 0;
  }
}
