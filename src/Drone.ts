import { Vec2 } from './Math';
import { NullResourceType, InHandType, Recipe } from './Recipe';
import Resource from './Resource';
import Game from './Game';

export class Drone {
  position: Vec2;
  inHand: InHandType = NullResourceType.EmptyHand;

  currentTarget: Resource | null = null;
  currentRecipe: Recipe | null = null;

  constructor({ position = Vec2.random() } = {}) {
    this.position = position;
  }

  update(game: Game) {
    if (this.currentTarget) {
      if (!this.position.moveTowards(this.currentTarget.position, 5)) {
        return;
      }

      this.craft(game);
    } else {
      // find recipe
    }
  }

  craft(game: Game) {
    if (!this.currentRecipe || !this.currentTarget) {
      throw 'Unexpected state';
    }
    this.inHand = this.currentRecipe.handResult;
    game.resources.delete(this.currentTarget);

    if (this.currentRecipe.floorResult != NullResourceType.EmptyFloor) {
      game.resources.add(
        new Resource({
          position: Vec2.copyOf(this.position),
          type: this.currentRecipe.floorResult,
        })
      );
    }

    this.currentRecipe = null;
    this.currentTarget = null;
  }
}
