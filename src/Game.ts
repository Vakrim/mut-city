import Collection from "./Collection";
import { Board } from "./Board";
import { Graphics } from "./Graphics";
import { Actor } from "./types";
import { Drone } from "./Drone";
import { Vec2, randomInt } from "./Math";
import { Resource } from "./Resource";

export class Game {
  board: Board;
  graphics: Graphics = new Graphics();
  actors: Collection<Actor>;

  init() {
    this.actors = new Collection();

    this.board = new Board();

    for (let i = 0; i < 50; i++) {
      const drone = new Drone(new Vec2(randomInt(0, 50), randomInt(0, 50)));
      this.actors.add(drone);
    }

    for (let i = 0; i < 50; i++) {
      const resource = new Resource(new Vec2(randomInt(0, 50), randomInt(0, 50)));
      this.actors.add(resource);
    }
  }

  run() {
    this.step();
  }

  step() {
    this.update();
    this.render();

    requestAnimationFrame(() => {
      this.step();
    })
  }

  update() {
    for (let actor of this.actors) {
      actor.update(this);
    }
  }

  render() {
    this.graphics.clear();
    for (let actor of this.actors) {
      actor.draw(this.graphics);
    }
  }
}
