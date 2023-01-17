import { Company, CompanyLifeCycle } from "./Company";
import { ProductType, Tomato } from "../Storage";

export default class TomatoFactory extends Company implements CompanyLifeCycle {
  produce() {
    if (this.storage.get(ProductType.Tomato) < 10) {
      this.storage.add(1, Tomato);
    }
  }

  makeOffers(): void {
    if (this.storage.get(ProductType.Tomato) > 0) {
      this.offer(ProductType.Tomato);
    }
  }
}
