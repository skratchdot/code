const { debug, run } = require('../../lib');

const ACTIVE = '#';
const INACTIVE = '.';

let id = 0;

class ActiveCube {
  constructor(x, y, z) {
    this.id = id++;
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

const isClose = (a, b) => a >= b - 1 && a <= b + 1;

class CubeSpace {
  constructor() {
    this.turn = 0;
    this.activeCubes = [];
  }
  addActive(x, y, z) {
    const cube = new ActiveCube(x, y, z);
    this.activeCubes.push(cube);
  }
  getNeighborPositions(cube) {
    const neighbors = [];
    for (let x = cube.x - 1; x <= cube.x + 1; x++) {
      for (let y = cube.y - 1; y <= cube.y + 1; y++) {
        for (let z = cube.z - 1; z <= cube.z + 1; z++) {
          if (x !== cube.x || y !== cube.y || z !== cube.z) {
            neighbors.push({ x, y, z });
          }
        }
      }
    }
    return neighbors;
  }
  isSame(cube1, cube2) {
    return cube1.x === cube2.x && cube1.y === cube2.y && cube1.z === cube2.z;
  }
  isNeighbor(cube, potentialNeighbor) {
    if (
      !this.isSame(cube, potentialNeighbor) &&
      isClose(cube.x, potentialNeighbor.x) &&
      isClose(cube.y, potentialNeighbor.y) &&
      isClose(cube.z, potentialNeighbor.z)
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

    // get ALL the neighbors, sorted. then we will go through and remove "active"
    // neighbors (handled above), and we will only keep the neighbors that show up 3 times
    const neighborsOfActive = this.activeCubes.reduce((prev, cube) => {
      return [...prev, ...this.getNeighborPositions(cube)];
    }, []);
    const uniqueNeighborsOfActive = neighborsOfActive.filter(
      (v1, i) => neighborsOfActive.findIndex((v2) => this.isSame(v1, v2)) === i
    );
    const uniqueInctiveNeighborsOfActive = uniqueNeighborsOfActive.filter(
      (v1) => this.activeCubes.findIndex((v2) => this.isSame(v1, v2)) === -1
    );
    const turnActive = uniqueInctiveNeighborsOfActive.filter(
      (cube) => this.getActiveNeighbors(cube).length === 3
    );
    turnActive.forEach((cube) => {
      this.addActive(cube.x, cube.y, cube.z);
    });

    debug({
      //neighborsOfActive,
      //uniqueNeighborsOfActive,
      //uniqueInctiveNeighborsOfActive,
      neighborsOfActiveLength: neighborsOfActive.length,
      uniqueNeighborsOfActiveLength: uniqueNeighborsOfActive.length,
      uniqueInctiveNeighborsOfActiveLength:
        uniqueInctiveNeighborsOfActive.length,
      turnActiveLength: turnActive.length,
    });
    this.activeCubes = [...keepActive, ...turnActive];
    this.turn++;
  }
}

const solve1 = (lines, numTurns) => {
  const cubeSpace = new CubeSpace();
  lines.forEach((line, x) => {
    line.split('').forEach((pos, y) => {
      if (pos === ACTIVE) {
        cubeSpace.addActive(x, y, 0);
      }
    });
  });
  while (cubeSpace.turn < numTurns) {
    cubeSpace.next();
  }
  return cubeSpace.activeCubes.length;
};

run(__dirname, 'inputtest', solve1, 112, { args: [6] });
run(__dirname, 'input', solve1, 401, { args: [6] });

/*
--- Day 17: Conway Cubes ---

As your flight slowly drifts through the sky, the Elves at the Mythical Information Bureau at the North Pole contact you. They'd like some help debugging a malfunctioning experimental energy source aboard one of their super-secret imaging satellites.

The experimental energy source is based on cutting-edge technology: a set of Conway Cubes contained in a pocket dimension! When you hear it's having problems, you can't help but agree to take a look.

The pocket dimension contains an infinite 3-dimensional grid. At every integer 3-dimensional coordinate (x,y,z), there exists a single cube which is either active or inactive.

In the initial state of the pocket dimension, almost all cubes start inactive. The only exception to this is a small flat region of cubes (your puzzle input); the cubes in this region start in the specified active (#) or inactive (.) state.

The energy source then proceeds to boot up by executing six cycles.

Each cube only ever considers its neighbors: any of the 26 other cubes where any of their coordinates differ by at most 1. For example, given the cube at x=1,y=2,z=3, its neighbors include the cube at x=2,y=2,z=2, the cube at x=0,y=2,z=3, and so on.

During a cycle, all cubes simultaneously change their state according to the following rules:

    If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
    If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.

The engineers responsible for this experimental energy source would like you to simulate the pocket dimension and determine what the configuration of cubes should be at the end of the six-cycle boot process.

For example, consider the following initial state:

.#.
..#
###

Even though the pocket dimension is 3-dimensional, this initial state represents a small 2-dimensional slice of it. (In particular, this initial state defines a 3x3x1 region of the 3-dimensional space.)

Simulating a few cycles from this initial state produces the following configurations, where the result of each cycle is shown layer-by-layer at each given z coordinate (and the frame of view follows the active cells in each cycle):

Before any cycles:

z=0
.#.
..#
###


After 1 cycle:

z=-1
#..
..#
.#.

z=0
#.#
.##
.#.

z=1
#..
..#
.#.


After 2 cycles:

z=-2
.....
.....
..#..
.....
.....

z=-1
..#..
.#..#
....#
.#...
.....

z=0
##...
##...
#....
....#
.###.

z=1
..#..
.#..#
....#
.#...
.....

z=2
.....
.....
..#..
.....
.....


After 3 cycles:

z=-2
.......
.......
..##...
..###..
.......
.......
.......

z=-1
..#....
...#...
#......
.....##
.#...#.
..#.#..
...#...

z=0
...#...
.......
#......
.......
.....##
.##.#..
...#...

z=1
..#....
...#...
#......
.....##
.#...#.
..#.#..
...#...

z=2
.......
.......
..##...
..###..
.......
.......
.......

After the full six-cycle boot process completes, 112 cubes are left in the active state.

Starting with your given initial configuration, simulate six cycles. How many cubes are left in the active state after the sixth cycle?

Your puzzle answer was 401.
 */
