import { Vec2 } from './Math';
import { ProductType } from './Storage';
import { Factory } from './factories/Factory';
import Game from './Game';
import { Behavior } from './behaviors/Beahavior';
import { Idle } from './behaviors/Idle';
import { WalkToGrabProduct } from './behaviors/WalkToGrabProduct';
import { GridNode } from './grid/GridNode';

export class Drone {
  position: Vec2;
  behavior: Behavior = new Idle();
  currentPath: GridNode[] | null = null;

  constructor({ position = Vec2.random() } = {}) {
    this.position = position;
  }

  carry(amount: number, type: ProductType, from: Factory, to: Factory) {
    this.behavior = new WalkToGrabProduct(amount, type, from, to);

    from.reservedOutbox.add(amount, type);
    to.reservedInbox.add(amount, type);
  }

  update(game: Game) {
    this.behavior.initOrUpdate(this, game);
  }
}
