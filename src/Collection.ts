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

  [Symbol.iterator]() {
    return this.set.values();
  }
}
