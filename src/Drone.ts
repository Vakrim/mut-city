import { Vec2 } from "./Math";
import { Actor } from "./types";
import { Graphics } from "./Graphics";
import { Game } from "./Game";
import { Resource } from "./Resource";
import { Path } from "./Path";
import { findByMin } from "./Collection";

export class Drone implements Actor {
  position: Vec2;
  animationFrame = 0;
  task: Task;

  constructor(position: Vec2) {
    this.position = position;
    this.task = new IdleTask();
  }

  draw(graphics: Graphics): void {
    graphics.drawSprite(
      this.position.x,
      this.position.y,
      this.animationFrame < 30
        ? graphics.tilesetLocations.drone1
        : graphics.tilesetLocations.drone2
    );

    if (this.task instanceof GrabResourceTask) {
      graphics.drawLine(
        this.position.x,
        this.position.y,
        this.task.resource.position.x,
        this.task.resource.position.y
      );

      let lastField = null;
      for (let tile of this.task.path.route) {
        if (lastField) {
          graphics.drawLine(
            lastField.position.x,
            lastField.position.y,
            tile.position.x,
            tile.position.y
          );
        }
        lastField = tile;
      }
    }
  }

  update(game: Game): void {
    this.animationFrame = (this.animationFrame + 1) % 60;

    if (this.animationFrame !== 0) {
      return;
    }

    const nextTask = this.task.update(this, game);

    if (!nextTask) {
      return;
    }

    this.task = nextTask;
  }
}

abstract class Task {
  abstract update(drone: Drone, game: Game): Task | undefined;
}

class IdleTask extends Task {
  update(drone: Drone, game: Game) {
    const unreservedResources = [...game.actors.getByType(Resource)].filter(
      resource => !resource.reserved
    );

    if (unreservedResources.length === 0) {
      return;
    }

    const nearestResource = findByMin(
      unreservedResources,
      (resource: Resource) => drone.position.distSquared(resource.position)
    );

    nearestResource.reserved = true;

    const path = game.board.findPath(drone.position, nearestResource.position);

    if (!path) {
      return;
    }

    return new GrabResourceTask(nearestResource, path);
  }
}

class GrabResourceTask extends Task {
  resource: Resource;
  path: Path;

  constructor(resource: Resource, path: Path) {
    super();
    this.resource = resource;
    this.path = path;
  }

  update(drone: Drone, game: Game) {
    const field = this.path.route.shift();

    if (!field) {
      return new IdleTask();
    }

    drone.position.copyFrom(field.position);
  }
}
