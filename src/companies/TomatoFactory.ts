import { Company } from "./Company";
import Game from "../Game";
import { ProductType, Tomato } from "../Storage";

export class TomatoFactory extends Company {
  update(game: Game) {
    if(this.outbox.get(ProductType.Tomato) < 100) {
      this.outbox.add(1, Tomato);
    }
  }
}
