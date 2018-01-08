import { Vec2 } from "./Math";

export type RoadParams = {
  position: Vec2,
}

export default class Road {
  position: Vec2

  constructor(params: RoadParams) {
    this.position = params.position;
  }

  pathCost() {
    return 1;
  }
}
