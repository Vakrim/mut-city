import { Vec2, ones, randomFromArray } from "./Math";
import * as rough from "roughjs";
import { Building } from "./companies/Building";
import { Factory } from "./companies/Factory";
import { Graph } from "./grid/Graph";
import { Market } from "./Market";
import { recipes } from "./recipes";
import { GameObjectCollection } from "./GameObjectsCollection";
import { Log } from "./Log";
import { Graphics } from "./Graphics";
import { Residential } from "./companies/Residential";

export default class Game {
  objects = new GameObjectCollection();
  gridSize = 50;
  graph: Graph = new Graph(ones(this.gridSize, this.gridSize));
  step: number = 0;
  market = new Market();
  log: Log = [];
  residentialStatus = { maxLevel: 1, missingBuildings: 3 };
  timeCompression = false;
  lastRenderTimestamp = 0;

  graphics: Graphics;
  canvas: HTMLCanvasElement;

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.graphics = rough.canvas(this.canvas);

    this.seed();
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

  createRandomResidential() {
    const position = Vec2.random(this.gridSize);

    if (!this.objects.isEmptySpace(position)) {
      return;
    }

    this.objects.add(new Residential(position, this.market, this.log));
  }

  run() {
    requestAnimationFrame((timestamp) => {
      this.requestUpdateFrame();
      this.requestRenderFrame(timestamp);
    });
  }

  requestUpdateFrame() {
    if (this.timeCompression) {
      const start = performance.now();
      while (performance.now() - start < 1000 / 120) {
        this.update();
      }
    } else {
      this.update();
    }

    requestAnimationFrame(() => {
      this.requestUpdateFrame();
    });
  }

  update() {
    this.step++;
    this.market.clear();
    this.log.length = 0;

    const removeCompany = (building: Building) => {
      this.objects.delete(building);
    };

    if (this.objects.size() < 500) {
      this.createRandomFactory();

      if (this.residentialStatus.missingBuildings > 0) {
        this.createRandomResidential();
        this.residentialStatus.missingBuildings--;
      }
    }

    for (let object of this.objects) {
      object.startDay?.();
    }
    for (let object of this.objects) {
      object.produce?.();
      if (
        object instanceof Residential &&
        object.level > this.residentialStatus.maxLevel
      ) {
        this.residentialStatus.maxLevel++;
        this.residentialStatus.missingBuildings +=
          this.residentialStatus.maxLevel;
      }
    }
    for (let object of this.objects) {
      object.makeOffers?.();
    }
    for (let object of this.objects) {
      object.buyFromMarket?.();
    }
    for (let object of this.objects) {
      object.finishDay?.(removeCompany);
    }
  }

  requestRenderFrame(timestamp: number) {
    if (timestamp - this.lastRenderTimestamp > 70) {
      this.render();
      this.lastRenderTimestamp = timestamp;
    }

    requestAnimationFrame((timestamp) => {
      this.requestRenderFrame(timestamp);
    });
  }

  render() {
    const context = this.canvas.getContext("2d")!;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const fillRed = { fill: "red" };
    const fillGreen = { fill: "green" };

    for (let object of this.objects) {
      this.graphics.rectangle(
        object.position.x * 10 + 1,
        object.position.y * 10 + 1,
        8,
        8,
        object instanceof Factory ? fillRed : fillGreen
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
  }
}
