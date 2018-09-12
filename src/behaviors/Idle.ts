import { Behavior } from "./Beahavior";
import { Drone } from "../Drone";
import Game from "../Game";
import { randomFromArray } from "../Math";
import { Tomato } from "../Storage";

export class Idle extends Behavior {
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
