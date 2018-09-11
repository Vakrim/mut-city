import { Vec2 } from './Math';
import { Storage, ProductType, Tomato } from './Storage';
import Game from './Game';

export abstract class Factory {
  position: Vec2;

  outbox: Storage = new Storage();
  reservedOutbox: Storage = new Storage();

  demand: Storage = new Storage();
  inbox: Storage = new Storage();
  reservedInbox: Storage = new Storage();

  constructor(position: Vec2 = Vec2.random()) {
    this.position = position;
    this.init();
  }

  init() {}

  take(amount: number, type: ProductType) {
    this.outbox.subtract(amount, type);
    this.reservedOutbox.subtract(amount, type);
  }

  bring(amount: number, type: ProductType) {
    this.inbox.add(amount, type);
    this.reservedInbox.subtract(amount, type);
    this.demand.subtract(amount, type);
  }

  update(game: Game) {}
}

export class TomatoFactory extends Factory {
  update(game: Game) {
    if(this.outbox.get(ProductType.Tomato) < 100) {
      this.outbox.add(1, Tomato);
    }
  }
}

export class TomatoSlicingFactory extends Factory {
  init() {
    this.demand.add(100, Tomato);
  }
}
