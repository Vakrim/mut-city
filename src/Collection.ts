export default class Collection<T> {
  set: Set<T>;

  constructor(ininitial: T[] = []) {
    this.set = new Set(ininitial);
  }

  find(predicate: (item: T) => Boolean): T | null {
    for (let element of this.set) {
      if (predicate(element)) {
        return element;
      }
    }
    return null;
  }

  add(item: T) {
    this.set.add(item);
    return item;
  }

  delete(item: T) {
    return this.set.delete(item);
  }

  reduce<N>(fn: (currentValue: N, item: T) => N, startValue: N) {
    let value = startValue;
    for (let element of this.set) {
      value = fn(value, element);
    }
    return value;
  }

  transform<N>(fn: (currentValue: N, item: T) => void, startValue: N) {
    let value = startValue;
    for (let element of this.set) {
      fn(value, element);
    }
    return value;
  }

  [Symbol.iterator]() {
    return this.set.values();
  }
}
