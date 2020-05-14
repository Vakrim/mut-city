import { Actor } from "./types";
import { Graphics } from "./Graphics";
import { Vec2 } from "./Math";

export class Resource implements Actor {
  position: Vec2;
  animationFrame = 0;
  reserved: boolean = false;

  constructor(position: Vec2) {
    this.position = position;
  }

  draw(graphics: Graphics): void {
    graphics.drawSprite(
      this.position.x,
      this.position.y,
      graphics.tilesetLocations.resource
    );

    this.animationFrame = (this.animationFrame + 1) % 60;
  }

  update(): void {}
}
