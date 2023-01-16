import Collection from "./Collection";

export class CollectionMap<K, V> {
  private map = new Map<K, Collection<V>>();

  get(key: K): Collection<V> {
    const existing = this.map.get(key);
    return existing ?? new Collection();
  }

  add(key: K, item: V) {
    const collection = this.map.get(key);

    if (collection) {
      collection.add(item);
    } else {
      this.map.set(key, new Collection([item]));
    }
  }

  delete(key: K, item: V) {
    const collection = this.map.get(key);

    if (!collection) {
      return false;
    }

    return collection.delete(item);
  }
}
