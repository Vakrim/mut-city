export class Storage {
  storage: Map<ProductType, number> = new Map();

  add(amount: number, type: ProductType) {
    const currentAmount = this.get(type);
    this.storage.set(type, currentAmount + amount);
  }

  subtract(amount: number, type: ProductType) {
    const currentAmount = this.get(type);
    const newAmount = currentAmount - amount;
    if (newAmount < 0) {
      throw new Error("Unexpected take");
    }
    this.storage.set(type, newAmount);
  }

  get(type: ProductType) {
    return this.storage.get(type) ?? 0;
  }
}

export enum ProductType {
  Tomato,
  SlicedTomato,
  TomatoSoup,
}

export const Tomato = ProductType.Tomato;
