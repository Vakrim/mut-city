import { Vec2 } from "./Math";

export default class Factory {
  position: Vec2
  age: number

  pathCost() {
    return 5;
  }
}
