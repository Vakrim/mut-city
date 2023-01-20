import { Product } from "./recipes";

export class Storage {
  storage: Map<Product, number> = new Map();

  add(amount: number, type: Product) {
    const currentAmount = this.get(type);
    const newAmount = currentAmount + amount;
    this.storage.set(type, newAmount);
    return newAmount;
  }

  subtract(amount: number, type: Product) {
    const currentAmount = this.get(type);
    const newAmount = currentAmount - amount;
    if (newAmount < 0) {
      throw new Error("Unexpected take");
    }
    this.storage.set(type, newAmount);
    return newAmount;
  }

  get(type: Product) {
    return this.storage.get(type) ?? 0;
  }
}
