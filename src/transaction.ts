import { Factory } from "./companies/Factory";
import { Residential } from "./companies/Residential";
import { getManhattanDistance } from "./grid/heuristics";
import { Log } from "./Log";
import { Market, Offer } from "./Market";
import { Product } from "./recipes";

export function transaction(
  type: Product,
  market: Market,
  buyer: Factory | Residential,
  log: Log
) {
  const offers = market.getOffers(type);

  let bestOffer: { offer: Offer; cost: number } | null = null;

  for (let offer of offers) {
    const distance = getManhattanDistance(
      offer.factory.position,
      buyer.position
    );
    const cost = offer.factory.price + distance * PRICE_PER_DISTANCE;

    if (!bestOffer || cost < bestOffer.cost) {
      bestOffer = { offer, cost };
    }
  }

  if (!bestOffer) {
    return false;
  }

  if (buyer instanceof Factory) {
    if (buyer.money < bestOffer.cost) {
      return false;
    }

    buyer.money -= bestOffer.cost;
  }

  bestOffer.offer.factory.money += bestOffer.offer.factory.price;
  bestOffer.offer.factory.price *= Math.random() / 50 + 1;

  buyer.storage.add(1, type);
  const restOfStockpile = bestOffer.offer.factory.storage.subtract(1, type);

  bestOffer.offer.factory.soldOnThisDay = true;

  if (restOfStockpile === 0) {
    market.removeOffer(bestOffer.offer);
  }

  log.push({
    type: "transaction",
    seller: bestOffer.offer.factory,
    buyer,
  });

  return true;
}

const PRICE_PER_DISTANCE = 1;
