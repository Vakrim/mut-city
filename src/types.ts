import { Graphics } from "./Graphics";
import { Game } from "./Game";

export interface Actor {
  draw(graphics: Graphics): void;
  update(game: Game): void;
}
