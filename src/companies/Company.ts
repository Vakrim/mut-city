import { Vec2 } from "../Math";
import { Storage, ProductType } from "../Storage";
import Game from "../Game";
import { Market } from "../Market";

export abstract class Company {
  outbox: Storage = new Storage();
  inbox: Storage = new Storage();
  demand: Storage = new Storage();

  constructor(readonly position: Vec2 = Vec2.random(), private market: Market) {
    this.init();
  }

  init() {}

  offer(amount: number, type: ProductType) {
    this.market.addOffer({
      amount,
      type,
      company: this,
    });
  }

  take(amount: number, type: ProductType) {
    this.outbox.subtract(amount, type);
  }

  bring(amount: number, type: ProductType) {
    this.inbox.add(amount, type);
    this.demand.subtract(amount, type);
  }

  update(game: Game) {}
}
