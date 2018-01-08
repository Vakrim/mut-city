import { Vec2 } from "./Math";
import Resource from "./Resource";
import { ResourcePath } from "./Path";

export type FactoryParams = {
  position: Vec2,
  requires: Resource[],
  provides: Resource,
}

export default class Factory {
  position: Vec2
  requires: Resource[]
  provides: Resource

  constructor(params: FactoryParams) {
    this.position = params.position;
    this.requires = params.requires;
    this.provides = params.provides;
  }

  pathCost() {
    return 5;
  }
}
