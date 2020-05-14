import { Drone } from "./Drone";
import { Resource } from "./Resource";

export default class Collection<T = {}> {
  readonly set: Set<T> = new Set();

  subCollections = new Map<Constructable, Subcollection<T>>([
    [Drone, new Subcollection(item => item instanceof Drone)],
    [Resource, new Subcollection(item => item instanceof Resource)]
  ]);

  getByType<R extends Constructable>(type: R) {
    const subcollection = this.subCollections.get(type);

    if(!subcollection) {
      throw new Error('No subcollection for this type')
    }
    
    return subcollection as Subcollection<InstanceType<R>>;
  }

  add(item: T) {
    this.set.add(item);

    for(let [,subCollection] of this.subCollections) {
      subCollection.maybeAdd(item);
    }

    return item;
  }

  delete(item: T) {
    for(let [,subCollection] of this.subCollections) {
      subCollection.delete(item);
    }

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

  random(): T {
    const arr = Array.from(this.set);

    const index = Math.floor(Math.random() * arr.length);
    return arr[index];
  }

  [Symbol.iterator]() {
    return this.set.values();
  }
}

class Subcollection<T> {
  readonly set = new Set<T>();
  predicate: Predicate<T>;

  constructor(predicate: Predicate<T>) {
    this.predicate = predicate;
  }

  maybeAdd(item: T) {
    if(this.predicate(item)) {
      this.set.add(item)
    }
  }

  delete(item: T) {
    return this.set.delete(item);
  }

  [Symbol.iterator]() {
    return this.set.values();
  }
}

interface Predicate<T> {
  (element: T): Boolean;
}

interface Constructable {
  new (...args: any[]): any;
}

interface WithCollection<T> {
  set: Set<T>
}

export function find<T>(collection: Iterable<T>, predicate: (item: T) => Boolean): T | null {
  for (let element of collection) {
    if (predicate(element)) {
      return element;
    }
  }
  return null;
}

export function findByMin<T>(collection: Iterable<T>, predicate: (item: T) => number) {
  let score = Infinity;
  let target = null;
  for (let element of collection) {
    const elementScore = predicate(element);
    if (elementScore < score) {
      score = elementScore;
      target = element;
    }
  }
  return target;
}