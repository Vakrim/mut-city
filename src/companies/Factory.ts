import { Company, CompanyLifeCycle } from "./Company";

export class Factory extends Company implements CompanyLifeCycle {
  init() {
    for (let product of this.recipe.out) {
      this.storage.add(3, product);
    }
  }

  produce() {
    const hasResources = this.recipe.in.every(
      (item) => this.storage.get(item) > 0
    );
    if (!hasResources) {
      return;
    }

    for (let product of this.recipe.in) {
      this.storage.subtract(1, product);
    }
    for (let product of this.recipe.out) {
      this.storage.add(1, product);
    }

    this.log.push({
      type: "produced",
      company: this,
    });
  }

  makeOffers(): void {
    for (let product of this.recipe.out) {
      if (this.storage.get(product) > 0) {
        this.offer(product);
      }
    }
  }

  buyFromMarket(): void {
    for (let product of this.recipe.in) {
      if (this.storage.get(product) < 5) {
        this.buy(product);
      }
    }
  }
}
