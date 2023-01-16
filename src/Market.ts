import { CollectionMap } from "./Collection";
import { Company } from "./companies/Company";
import { ProductType } from "./Storage";

export class Market {
  private offers = new CollectionMap<ProductType, Offer>();

  addOffer(offer: Offer) {
    this.offers.set;
  }
}

export interface Offer {
  amount: number;
  type: ProductType;
  company: Company;
}
