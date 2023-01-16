import { Vec2 } from '../Math';
import { TomatoFactory } from './TomatoFactory';

describe('Factory', () => {
  it('stores position', () => {
    const position = new Vec2(2, 3);

    const factory = new TomatoFactory(position);

    expect(factory.position).toBe(position);
  });
});
