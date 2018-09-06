import { Graph, astar } from './AStar';

// prettier-ignore
const map = [
  [1, 1, 1, 1],
  [0, 0, 0, 1],
  [0, 0, 0, 1],
  [0, 0, 0, 1]
];

// prettier-ignore
const map2 = [
  [1, 1, 1, 1],
  [0, 1, 0, 1],
  [0, 1, 2, 1],
  [0, 0, 0, 1]
];

describe('A*', () => {
  it('finds way', () => {
    const graph = new Graph(map);

    const start = graph.grid[0][0];
    const end = graph.grid[3][3];

    expect(astar.search(graph, start, end).map(n => [n.x, n.y])).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  });

  it('cuts corners way', () => {
    const graph = new Graph(map, { diagonal: true });

    const start = graph.grid[0][0];
    const end = graph.grid[3][3];

    expect(astar.search(graph, start, end).map(n => [n.x, n.y])).toEqual([
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);
  });

  it('is reusable', () => {
    const graph = new Graph(map2);

    const start = graph.grid[0][0];
    const end = graph.grid[3][3];

    expect(astar.search(graph, start, end).map(n => [n.x, n.y])).toEqual([
      [0, 1],
      [0, 2],
      [0, 3],
      [1, 3],
      [2, 3],
      [3, 3],
    ]);

    expect(astar.search(graph, end, start).map(n => [n.x, n.y])).toEqual([
      [2, 3],
      [1, 3],
      [0, 3],
      [0, 2],
      [0, 1],
      [0, 0],
    ]);
  });

  it('handles changes in grid', () => {
    // prettier-ignore
    const grid = [
      [1, 1, 1],
      [0, 0, 1],
      [1, 1, 1]
    ];

    const graph = new Graph(grid);

    const start = graph.grid[0][0];
    const end = graph.grid[2][0];

    expect(astar.search(graph, start, end).map(n => [n.x, n.y])).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
      [2, 2],
      [2, 1],
      [2, 0],
    ]);

    graph.grid[1][1].weight = 1;

    expect(astar.search(graph, start, end).map(n => [n.x, n.y])).toEqual([
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
    ]);
  })
});
