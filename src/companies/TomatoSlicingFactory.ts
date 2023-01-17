import { ProductType } from "../Storage";
import { Company, CompanyLifeCycle } from "./Company";

export class TomatoSlicingFactory extends Company implements CompanyLifeCycle {
  produce() {
    if (this.storage.get(ProductType.Tomato) > 0) {
      this.storage.add(1, ProductType.SlicedTomato);
      this.storage.subtract(1, ProductType.Tomato);
    }
  }
  
  buyFromMarket(): void {
    if(this.storage.get(ProductType.Tomato) < 5) {
      this.buy(ProductType.Tomato)
    }
  }
}
