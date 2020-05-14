import { Resource } from "./Resource";
import { Field } from "./Board";

export class Path {
  // path: Field[];
  start: Field;
  end: Field;
  route: Field[];

  constructor(path: Field[]) {
    // this.path = path;
    const route = [...path];
    this.start = route.shift();
    this.end = route.pop();
    this.route = route;
  }
}

export class ResourcePath extends Path {
  resource: Resource;

  constructor(path: Field[], resource: Resource) {
    super(path);
    this.resource = resource;
  }
}
