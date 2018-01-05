function strEnum<T extends string>(o: Array<T>): { [K in T]: K } {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}

const ResourceTypes = strEnum(["Wood", "Log"]);
type ResourceType = keyof typeof ResourceTypes;

export default class Resource {
  type: ResourceType;
  amount: number;
}
