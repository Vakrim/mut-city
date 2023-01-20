import { Market } from '../Market';
import { Vec2 } from '../Math';
import Factory from './Factory';

describe('Factory', () => {
  it('stores position', () => {
    const position = new Vec2(2, 3);

    const market = new Market();

    const factory = new Factory(position, market);

    expect(factory.position).toBe(position);
  });
});
