import Collection from "./Collection";
import { CollectionMap } from "./CollectionMap";
import { Factory } from "./companies/Factory";
import { Product } from "./recipes";

export class Market {
  private offers = new CollectionMap<Product, Offer>();

  addOffer(offer: Offer) {
    this.offers.add(offer.type, offer);
  }

  getOffers(type: Product): Collection<Offer> {
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
  type: Product;
  factory: Factory;
}
