import Collection from "./Collection";
import { Building } from "./companies/Building";
import { Vec2 } from "./Math";

type GameObject = Building;

export class GameObjectCollection implements Iterable<GameObject> {
  private collection = new Collection<GameObject>();
  private positions: Map<string, GameObject> = new Map();

  add(item: GameObject) {
    this.collection.add(item);
    this.positions.set(this.getPositionKey(item.position), item);
  }

  delete(item: GameObject) {
    this.collection.delete(item);
    this.positions.delete(this.getPositionKey(item.position));
  }

  size() {
    return this.collection.size();
  }

  isEmptySpace(position: Vec2) {
    return !this.positions.has(this.getPositionKey(position));
  }

  find(predicate: (item: GameObject) => Boolean) {
    return this.collection.find(predicate);
  }

  private getPositionKey(position: Vec2) {
    return `${position.x},${position.y}`;
  }

  *[Symbol.iterator]() {
    yield* this.collection;
  }
}
