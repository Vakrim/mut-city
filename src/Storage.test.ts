import { Storage, ProductType } from "./Storage";

describe('Storage', () => {
  it('sum products', () => {
    const storage = new Storage();

    expect(storage.get(ProductType.Tomato)).toEqual(0);

    storage.add(20, ProductType.Tomato);

    expect(storage.get(ProductType.Tomato)).toEqual(20);

    storage.add(30, ProductType.Tomato);

    expect(storage.get(ProductType.Tomato)).toEqual(50);
  })
})
