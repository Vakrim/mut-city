import { Vec2 } from "../Math";
import { Storage } from "../Storage";
import { Market, Offer } from "../Market";
import { getManhattanDistance } from "../grid/heuristics";
import { Product, Recipe } from "../recipes";
import { Log } from "../Log";

export abstract class Company {
  protected storage = new Storage();
  public price = 10;
  public money = 1000;
  public soldOnThisDay = false;

  constructor(
    readonly position: Vec2,
    protected recipe: Recipe,
    private market: Market,
    protected log: Log
  ) {
    this.init();
  }

  public init() {}

  public take(amount: number, type: Product) {
    this.storage.subtract(amount, type);
  }

  public startDay() {
    this.soldOnThisDay = false;
  }

  public finishDay(reportBankruptcy: (company: Company) => void) {
    if (!this.soldOnThisDay) {
      this.price *= 1 - Math.random() / 50;
    }
    this.money -= 10;

    if (this.money < 0) {
      reportBankruptcy(this);
    }
  }

  protected offer(type: Product) {
    this.market.addOffer({
      type,
      company: this,
    });
  }

  protected buy(type: Product) {
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

    if (this.money < bestOffer.cost) {
      return false;
    }

    this.money -= bestOffer.cost;
    bestOffer.offer.company.money += bestOffer.offer.company.price;
    bestOffer.offer.company.price *= Math.random() / 50 + 1;

    this.storage.add(1, type);
    const restOfStockpile = bestOffer.offer.company.storage.subtract(1, type);

    bestOffer.offer.company.soldOnThisDay = true;

    if (restOfStockpile === 0) {
      this.market.removeOffer(bestOffer.offer);
    }

    this.log.push({
      type: "transaction",
      seller: bestOffer.offer.company,
      buyer: this,
    });

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
