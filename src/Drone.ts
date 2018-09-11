import { Vec2, randomFromArray } from './Math';
import { ProductType, Tomato } from './Storage';
import { Factory } from './Factory';
import Game from './Game';
import { GridNode, findPath, Graph } from './AStar';

export class Drone {
  position: Vec2;
  behavior: Behavior = new IdleBehavior();
  currentPath: GridNode[] | null = null;

  constructor({ position = Vec2.random() } = {}) {
    this.position = position;
  }

  carry(amount: number, type: ProductType, from: Factory, to: Factory) {
    this.behavior = new WalkToGrabProductBehavior(amount, type, from, to);

    from.reservedOutbox.add(amount, type);
    to.reservedInbox.add(amount, type);
  }

  update(game: Game) {
    this.behavior.initOrUpdate(this, game);
  }
}

abstract class Behavior {
  isInitialized: boolean = false;

  initOrUpdate(drone: Drone, game: Game) {
    if (this.isInitialized) {
      this.update(drone, game);
    } else {
      this.init(drone, game);
      this.isInitialized = true;
    }
  }

  update(drone: Drone, game: Game): void {}

  init(drone: Drone, game: Game): void {}
}

export class IdleBehavior extends Behavior {
  update(drone: Drone, game: Game) {
    const factories = game.factories();

    const factoryOut = randomFromArray(factories);
    const factoryIn = randomFromArray(factories);

    if (factoryOut === factoryIn) {
      return;
    }

    const possibleToTake =
      factoryOut.outbox.get(Tomato) - factoryOut.reservedOutbox.get(Tomato);
    const possibleToBring =
      factoryIn.demand.get(Tomato) - factoryIn.reservedInbox.get(Tomato);

    if (possibleToTake > 0 && possibleToBring > 0) {
      drone.carry(
        Math.min(possibleToTake, possibleToBring),
        Tomato,
        factoryOut,
        factoryIn
      );
      return;
    }
  }
}

export class WalkToGrabProductBehavior extends Behavior {
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
      drone.behavior = new WalkToDropProductBehavior(
        this.amount,
        this.productType,
        this.to
      );
    }
  }
}

export class WalkToDropProductBehavior extends Behavior {
  public path: GridNode[];

  constructor(
    public amount: number,
    public productType: ProductType,
    public to: Factory
  ) {
    super();
  }

  init(drone: Drone, game: Game) {
    this.path = findPath(
      game.graph,
      game.graph.grid[drone.position.x][drone.position.y],
      game.graph.grid[this.to.position.x][this.to.position.y]
    );
  }

  update(drone: Drone, game: Game) {
    if (this.path.length) {
      const nextStep = this.path.shift();
      drone.position = new Vec2(nextStep.x, nextStep.y);
    } else {
      this.to.bring(this.amount, this.productType);
      drone.behavior = new IdleBehavior();
    }
  }
}
