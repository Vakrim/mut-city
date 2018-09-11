import { TomatoFactory } from './Factory';
import { Tomato } from './Storage';
import { Drone, WalkToGrabProductBehavior } from './Drone';

describe('Drone', () => {
  it('reserves products in factories', () => {
    const factoryA = new TomatoFactory();
    factoryA.outbox.add(20, Tomato);

    const factoryB = new TomatoFactory();
    factoryB.demand.add(30, Tomato);

    const drone = new Drone();

    drone.carry(20, Tomato, factoryA, factoryB);

    expect(factoryA.outbox.get(Tomato)).toEqual(20);
    expect(factoryA.reservedOutbox.get(Tomato)).toEqual(20);

    expect(factoryB.demand.get(Tomato)).toEqual(30);
    expect(factoryB.reservedInbox.get(Tomato)).toEqual(20);

    expect(drone.behavior).toBeInstanceOf(WalkToGrabProductBehavior);

    const behavior = drone.behavior as WalkToGrabProductBehavior;

    expect(behavior.productType).toBe(Tomato);
    expect(behavior.amount).toBe(20);
  });
});
