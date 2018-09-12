import { WalkToDropProduct } from './WalkToDropProduct';
import { Behavior } from './Beahavior';
import { findPath } from '../grid/findPath';
import { ProductType } from '../Storage';
import { Factory } from '../factories/Factory';
import { Drone } from '../Drone';
import Game from '../Game';
import { Vec2 } from '../Math';
import { GridNode } from '../grid/GridNode';

export class WalkToGrabProduct extends Behavior {
  public path: GridNode[];

  constructor(
    public amount: number,
    public productType: ProductType,
    public from: Factory,
    public to: Factory
  ) {
    super();
  }

  init(drone: Drone, game: Game) {
    this.path = findPath(
      game.graph,
      game.graph.grid[drone.position.x][drone.position.y],
      game.graph.grid[this.from.position.x][this.from.position.y]
    );
  }

  update(drone: Drone, game: Game) {
    if (this.path.length) {
      const nextStep = this.path.shift();
      drone.position = new Vec2(nextStep.x, nextStep.y);
    } else {
      this.from.take(this.amount, this.productType);
      drone.behavior = new WalkToDropProduct(
        this.amount,
        this.productType,
        this.to
      );
    }
  }
}
