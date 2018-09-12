import { Drone } from "../Drone";
import Game from "../Game";

export abstract class Behavior {
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
