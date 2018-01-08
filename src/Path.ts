import { HasPosition } from "./Game";
import Resource from "./Resource";

export default class Path {
  path: HasPosition[];
  start: HasPosition;
  end: HasPosition;
  route: HasPosition[];

  constructor(path: HasPosition[]) {
    this.path = path;
    const route = [...path];
    this.start = <HasPosition>route.shift();
    this.end = <HasPosition>route.pop();
    this.route = route;
  }
}

export class ResourcePath extends Path {
  resource: Resource

  constructor(path: HasPosition[], resource: Resource) {
    super(path);
    this.resource = resource;
  }
}
