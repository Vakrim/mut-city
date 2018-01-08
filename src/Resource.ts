function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

const ResourceTypes = strEnum(["Wood", "Log", "Point"]);
export type ResourceType = keyof typeof ResourceTypes;

export default class Resource {
  amount: number;
  type: ResourceType;

  constructor(amount: number, type: ResourceType) {
    this.amount = amount;
    this.type = type;
  }
}
