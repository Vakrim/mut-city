import { Log } from "../Log";
import { Market } from "../Market";
import { Vec2 } from "../Math";
import { Product } from "../recipes";
import { Storage } from "../Storage";
import { transaction } from "../transaction";
import { Building } from "./Building";

export class Residential implements Building {
  public level = 1;
  readonly storage = new Storage();

  constructor(
    readonly position: Vec2,
    private market: Market,
    private log: Log
  ) {}

  produce(): void {
    if(this.hasAllNeededResources() && this.level < 3) {
      this.level++;
    }
    this.storage.clear()
  }

  private hasAllNeededResources() {
    for (let needLevel = 1; needLevel <= this.level; needLevel++) {
      const needsFromThisLevels = residentialNeeds[needLevel];
      const amountNeeded = this.level - needLevel + 1;

      for (let product of needsFromThisLevels) {
        for (let i = 0; i < amountNeeded; i++) {
          if (this.storage.get(product) < amountNeeded) {
            return false;
          }
        }
      }
    }
    return true;
  }

  buyFromMarket(): void {
    for (let needLevel = 1; needLevel <= this.level; needLevel++) {
      const needsFromThisLevels = residentialNeeds[needLevel];
      const amountNeeded = this.level - needLevel + 1;

      for (let product of needsFromThisLevels) {
        for (let i = 0; i < amountNeeded; i++) {
          const success = transaction(product, this.market, this, this.log);
          if (!success) break;
        }
      }
    }
  }
}

const residentialNeeds: {
  [level: number]: Product[];
} = { 1: ["rice", "tomato"], 2: ["soup"], 3: ["furniture"] };
