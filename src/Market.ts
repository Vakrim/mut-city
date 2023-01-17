import Collection from "./Collection";
import { CollectionMap } from "./CollectionMap";
import { Company } from "./companies/Company";
import { ProductType } from "./Storage";

export class Market {
  private offers = new CollectionMap<ProductType, Offer>();

  addOffer(offer: Offer) {
    this.offers.add(offer.type, offer);
  }

  getOffers(type: ProductType): Collection<Offer> {
    return this.offers.get(type);
  }

  removeOffer(offer: Offer) {
    this.offers.delete(offer.type, offer);
  }

  clear() {
    this.offers = new CollectionMap();
  }
}

export interface Offer {
  type: ProductType;
  company: Company;
}
