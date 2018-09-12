import { Factory } from "./Factory";
import { Tomato } from "../Storage";

export class TomatoSlicingFactory extends Factory {
  init() {
    this.demand.add(100, Tomato);
  }
}
