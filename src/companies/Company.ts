import { Vec2 } from "../Math";
import { Storage, ProductType } from "../Storage";
import { Market, Offer } from "../Market";
import { getManhattanDistance } from "../grid/heuristics";

export abstract class Company {
  protected storage = new Storage();
  public price = 10;
  public money = 1000;
  public soldOnThisDay = false;

  constructor(readonly position: Vec2 = Vec2.random(), private market: Market) {
    this.init();
  }

  public init() {}

  public take(amount: number, type: ProductType) {
    this.storage.subtract(amount, type);
  }

  public startDay() {
    this.soldOnThisDay = false;
  }

  public finishDay(reportBankruptcy: (company: Company) => void) {
    if(!this.soldOnThisDay) {
      this.price *= 1 - Math.random() / 50;
    }
    this.money -= 10;

    if(this.money < 0) {
      reportBankruptcy(this);
    }
  }

  protected offer(type: ProductType) {
    this.market.addOffer({
      type,
      company: this,
    });
  }

  protected buy(type: ProductType) {
    const offers = this.market.getOffers(type);

    let bestOffer: { offer: Offer; cost: number } | null = null;

    for (let offer of offers) {
      const distance = getManhattanDistance(
        offer.company.position,
        this.position
      );
      const cost = offer.company.price + distance * PRICE_PER_DISTANCE;

      if (!bestOffer || cost < bestOffer.cost) {
        bestOffer = { offer, cost };
      }
    }

    if (!bestOffer) {
      return false;
    }

    console.log(bestOffer)

    if(this.money < bestOffer.cost) {
      return false;
    }

    this.money -= bestOffer.cost;
    bestOffer.offer.company.money += bestOffer.offer.company.price;
    bestOffer.offer.company.price *= Math.random() / 50 + 1;

    this.storage.add(1, type);
    const restOfStockpile = bestOffer.offer.company.storage.subtract(1, type);

    bestOffer.offer.company.soldOnThisDay = true;

    if(restOfStockpile === 0) {
      this.market.removeOffer(bestOffer.offer);
    }

    return true;
  }
}

const PRICE_PER_DISTANCE = 0.1;

export interface CompanyLifeCycle {
  init?(): void;

  produce?(): void;

  makeOffers?(): void;

  buyFromMarket?(): void;
}
