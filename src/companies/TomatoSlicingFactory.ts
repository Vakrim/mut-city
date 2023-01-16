import { Company } from "./Company";
import { Tomato } from "../Storage";

export class TomatoSlicingFactory extends Company {
  init() {
    this.demand.add(100, Tomato);
  }
}
