import { Log } from "../Log";
import { Market } from "../Market";
import { Vec2 } from "../Math";
import { Product, Recipe } from "../recipes";
import { Storage } from "../Storage";
import { transaction } from "../transaction";
import { Building } from "./Building";

export class Factory implements Building {
  public price = 10;
  public money = 500;
  public soldOnThisDay = false;
  public storage = new Storage();

  constructor(
    readonly position: Vec2,
    private recipe: Recipe,
    private market: Market,
    private log: Log
  ) {}

  public startDay() {
    this.soldOnThisDay = false;
  }

  public produce() {
    const hasResources = this.recipe.in.every(
      (item) => this.storage.get(item) > 0
    );
    if (!hasResources) {
      return;
    }

    for (let product of this.recipe.in) {
      this.storage.subtract(1, product);
    }
    for (let product of this.recipe.out) {
      this.storage.add(1, product);
    }

    this.log.push({
      type: "produced",
      company: this,
    });
  }

  public makeOffers(): void {
    for (let product of this.recipe.out) {
      if (this.storage.get(product) > 0) {
        this.offer(product);
      }
    }
  }

  public buyFromMarket(): void {
    for (let product of this.recipe.in) {
      if (this.storage.get(product) < 5) {
        transaction(product, this.market, this, this.log);
      }
    }
  }

  public finishDay(reportBankruptcy: (building: Building) => void) {
    if (!this.soldOnThisDay) {
      this.price *= 1 - Math.random() / 50;
    }
    this.money -= 10;

    if (this.money < 0) {
      reportBankruptcy(this);
    }
  }

  protected offer(type: Product) {
    this.market.addOffer({
      type,
      factory: this,
    });
  }
}
