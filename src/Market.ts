import { CollectionMap } from "./CollectionMap";
import { Company } from "./companies/Company";
import { ProductType } from "./Storage";

export class Market {
  private offers = new CollectionMap<ProductType, Offer>();

  addOffer(offer: Offer) {
    this.offers.add(offer.type, offer);
  }
}

export interface Offer {
  amount: number;
  type: ProductType;
  company: Company;
}
