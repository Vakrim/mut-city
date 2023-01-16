import { Vec2 } from "../Math";
import { Storage, ProductType } from "../Storage";
import { Market } from "../Market";

export abstract class Company {
  protected storage = new Storage();

  constructor(readonly position: Vec2 = Vec2.random(), private market: Market) {
    this.init();
  }

  init() {}

  protected offer(amount: number, type: ProductType) {
    this.market.addOffer({
      amount,
      type,
      company: this,
    });
  }

  take(amount: number, type: ProductType) {
    this.storage.subtract(amount, type);
  }
}

export interface CompanyLifeCycle {
  init?(): void;

  produce?(): void;

  makeOffers?(): void;

  buyFromMarket?(): void;
}
