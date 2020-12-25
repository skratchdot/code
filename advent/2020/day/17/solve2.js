const { debug, run } = require('../lib');

const ACTIVE = '#';
const INACTIVE = '.';

let id = 0;

class ActiveCube {
  constructor(x, y, z, w) {
    this.id = id++;
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

const isClose = (a, b) => a >= b - 1 && a <= b + 1;

class CubeSpace {
  constructor() {
    this.turn = 0;
    this.activeCubes = [];
  }
  addActive(x, y, z, w) {
    const cube = new ActiveCube(x, y, z, w);
    this.activeCubes.push(cube);
  }
  getNeighborPositions(cube) {
    const neighbors = [];
    for (let x = cube.x - 1; x <= cube.x + 1; x++) {
      for (let y = cube.y - 1; y <= cube.y + 1; y++) {
        for (let z = cube.z - 1; z <= cube.z + 1; z++) {
          for (let w = cube.w - 1; w <= cube.w + 1; w++) {
            if (x !== cube.x || y !== cube.y || z !== cube.z || w !== cube.w) {
              neighbors.push({ x, y, z, w });
            }
          }
        }
      }
    }
    return neighbors;
  }
  isSame(cube1, cube2) {
    return (
      cube1.x === cube2.x &&
      cube1.y === cube2.y &&
      cube1.z === cube2.z &&
      cube1.w === cube2.w
    );
  }
  isNeighbor(cube, potentialNeighbor) {
    if (
      !this.isSame(cube, potentialNeighbor) &&
      isClose(cube.x, potentialNeighbor.x) &&
      isClose(cube.y, potentialNeighbor.y) &&
      isClose(cube.z, potentialNeighbor.z) &&
      isClose(cube.w, potentialNeighbor.w)
    ) {
      return true;
    } else {
      return false;
    }
  }
  getActiveNeighbors(cube) {
    return this.activeCubes.filter((current) => this.isNeighbor(cube, current));
  }
  next() {
    debug({ turn: this.turn, numActive: this.activeCubes.length });
    const keepActive = this.activeCubes.filter((cube) => {
      // If a cube is active and exactly 2 or 3 of its neighbors are also active,
      // the cube remains active. Otherwise, the cube becomes inactive.
      const activeNeighbors = this.getActiveNeighbors(cube);
      return [2, 3].includes(activeNeighbors.length);
    });

    const neighborsOfActive = this.activeCubes.reduce((prev, cube) => {
      return [...prev, ...this.getNeighborPositions(cube)];
    }, []);
    const uniqueNeighborsOfActive = neighborsOfActive.filter(
      (v1, i) => neighborsOfActive.findIndex((v2) => this.isSame(v1, v2)) === i
    );
    const uniqueInactiveNeighborsOfActive = uniqueNeighborsOfActive.filter(
      (v1) => this.activeCubes.findIndex((v2) => this.isSame(v1, v2)) === -1
    );
    const turnActive = uniqueInactiveNeighborsOfActive.filter(
      (cube) => this.getActiveNeighbors(cube).length === 3
    );
    turnActive.forEach((cube) => {
      this.addActive(cube.x, cube.y, cube.z, cube.w);
    });

    debug({
      //neighborsOfActive,
      //uniqueNeighborsOfActive,
      //uniqueInactiveNeighborsOfActive,
      neighborsOfActiveLength: neighborsOfActive.length,
      uniqueNeighborsOfActiveLength: uniqueNeighborsOfActive.length,
      uniqueInactiveNeighborsOfActiveLength:
        uniqueInactiveNeighborsOfActive.length,
      turnActiveLength: turnActive.length,
    });
    this.activeCubes = [...keepActive, ...turnActive];
    this.turn++;
  }
}

const solve2 = (lines, numTurns) => {
  const cubeSpace = new CubeSpace();
  lines.forEach((line, x) => {
    line.split('').forEach((pos, y) => {
      if (pos === ACTIVE) {
        cubeSpace.addActive(x, y, 0, 0);
      }
    });
  });
  while (cubeSpace.turn < numTurns) {
    cubeSpace.next();
  }
  return cubeSpace.activeCubes.length;
};

run(__dirname, 'inputtest', solve2, 848, { args: [6] });
run(__dirname, 'input', solve2, 2224, { args: [6] });

/*
--- Part Two ---

For some reason, your simulated results don't match what the experimental energy source engineers expected. Apparently, the pocket dimension actually has four spatial dimensions, not three.

The pocket dimension contains an infinite 4-dimensional grid. At every integer 4-dimensional coordinate (x,y,z,w), there exists a single cube (really, a hypercube) which is still either active or inactive.

Each cube only ever considers its neighbors: any of the 80 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3,w=4, its neighbors include the cube at x=2,y=2,z=3,w=3, the cube at x=0,y=2,z=3,w=4, and so on.

The initial state of the pocket dimension still consists of a small flat region of cubes. Furthermore, the same rules for cycle updating still apply: during each cycle, consider the number of active neighbors of each cube.

For example, consider the same initial state as in the example above. Even though the pocket dimension is 4-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1x1 region of the 4-dimensional space.)

Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z and w coordinate:

Before any cycles:

z=0, w=0
.#.
..#
###


After 1 cycle:

z=-1, w=-1
#..
..#
.#.

z=0, w=-1
#..
..#
.#.

z=1, w=-1
#..
..#
.#.

z=-1, w=0
#..
..#
.#.

z=0, w=0
#.#
.##
.#.

z=1, w=0
#..
..#
.#.

z=-1, w=1
#..
..#
.#.

z=0, w=1
#..
..#
.#.

z=1, w=1
#..
..#
.#.


After 2 cycles:

z=-2, w=-2
.....
.....
..#..
.....
.....

z=-1, w=-2
.....
.....
.....
.....
.....

z=0, w=-2
###..
##.##
#...#
.#..#
.###.

z=1, w=-2
.....
.....
.....
.....
.....

z=2, w=-2
.....
.....
..#..
.....
.....

z=-2, w=-1
.....
.....
.....
.....
.....

z=-1, w=-1
.....
.....
.....
.....
.....

z=0, w=-1
.....
.....
.....
.....
.....

z=1, w=-1
.....
.....
.....
.....
.....

z=2, w=-1
.....
.....
.....
.....
.....

z=-2, w=0
###..
##.##
#...#
.#..#
.###.

z=-1, w=0
.....
.....
.....
.....
.....

z=0, w=0
.....
.....
.....
.....
.....

z=1, w=0
.....
.....
.....
.....
.....

z=2, w=0
###..
##.##
#...#
.#..#
.###.

z=-2, w=1
.....
.....
.....
.....
.....

z=-1, w=1
.....
.....
.....
.....
.....

z=0, w=1
.....
.....
.....
.....
.....

z=1, w=1
.....
.....
.....
.....
.....

z=2, w=1
.....
.....
.....
.....
.....

z=-2, w=2
.....
.....
..#..
.....
.....

z=-1, w=2
.....
.....
.....
.....
.....

z=0, w=2
###..
##.##
#...#
.#..#
.###.

z=1, w=2
.....
.....
.....
.....
.....

z=2, w=2
.....
.....
..#..
.....
.....

After the full six-cycle boot process completes, 848 cubes are left in the active state.

Starting with your given initial configuration, simulate six cycles in a 4-dimensional space. How many cubes are left in the active state after the sixth cycle?

Your puzzle answer was 2224.
 */
