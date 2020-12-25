const { debug, run } = require('../../lib');

/*
    If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    If a seat is occupied (#) and five or more seats adjacent to it are also occupied, the seat becomes empty.
    Otherwise, the seat's state does not change.
*/

const isFree = (grid, row, rowDir, col, colDir) => {
  let newRowDir = rowDir;
  let newColDir = colDir;
  try {
    while (1) {
      let spot = grid[row + newRowDir][col + newColDir];
      if (spot === '#') {
        return false;
      } else if (spot === 'L') {
        return true;
      } else if (spot === '.') {
        newRowDir += rowDir;
        newColDir += colDir;
      } else {
        return true;
      }
    }
  } catch (err) {}
  return true;
};

const isSeated = (grid, row, rowDir, col, colDir) => {
  let newRowDir = rowDir;
  let newColDir = colDir;
  try {
    while (1) {
      let spot = grid[row + newRowDir][col + newColDir];
      if (spot === '#') {
        return true;
      } else if (spot === 'L') {
        return false;
      } else if (spot === '.') {
        newRowDir += rowDir;
        newColDir += colDir;
      } else {
        return false;
      }
    }
  } catch (err) {}
  return false;
};

const isNotOccupied = (grid, row, col) =>
  isFree(grid, row, -1, col, -1) &&
  isFree(grid, row, 0, col, -1) &&
  isFree(grid, row, +1, col, -1) &&
  isFree(grid, row, -1, col, 0) &&
  isFree(grid, row, +1, col, 0) &&
  isFree(grid, row, -1, col, +1) &&
  isFree(grid, row, 0, col, +1) &&
  isFree(grid, row, +1, col, +1);

const isOccupied = (grid, row, col) => {
  let numSeats = 0;
  numSeats += isSeated(grid, row, -1, col, -1) ? 1 : 0;
  numSeats += isSeated(grid, row, 0, col, -1) ? 1 : 0;
  numSeats += isSeated(grid, row, +1, col, -1) ? 1 : 0;
  numSeats += isSeated(grid, row, -1, col, 0) ? 1 : 0;
  numSeats += isSeated(grid, row, +1, col, 0) ? 1 : 0;
  numSeats += isSeated(grid, row, -1, col, +1) ? 1 : 0;
  numSeats += isSeated(grid, row, 0, col, +1) ? 1 : 0;
  numSeats += isSeated(grid, row, +1, col, +1) ? 1 : 0;
  return numSeats >= 5;
};

const shouldBecomeOccupied = (grid, row, col) =>
  grid[row][col] === 'L' && isNotOccupied(grid, row, col);

const shouldBecomeEmpty = (grid, row, col) =>
  grid[row][col] === '#' && isOccupied(grid, row, col);

const changeGrid = (grid) => {
  const newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    newGrid[i] = [];
    for (let j = 0; j < grid[i].length; j++) {
      if (shouldBecomeOccupied(grid, i, j)) {
        newGrid[i][j] = '#';
      } else if (shouldBecomeEmpty(grid, i, j)) {
        newGrid[i][j] = 'L';
      } else {
        newGrid[i][j] = grid[i][j];
      }
    }
  }
  return newGrid;
};

const printGrid = (grid) => debug(gridString(grid));

const gridString = (grid) => '\n' + grid.map((row) => row.join('')).join('\n');

const solve2 = (lines) => {
  let grid = lines.map((line) => line.split(''));
  let previousGrid;
  do {
    printGrid(grid);
    previousGrid = grid;
    grid = changeGrid(grid);
  } while (gridString(previousGrid) !== gridString(grid));
  printGrid(grid);

  return gridString(grid)
    .split('')
    .filter((v) => v === '#').length;
};

run(__dirname, 'inputtest', solve2, 26);
run(__dirname, 'input', solve2, 2124);

/*
--- Part Two ---

As soon as people start to arrive, you realize your mistake. People don't just care about adjacent seats - they care about the first seat they can see in each of those eight directions!

Now, instead of considering just the eight immediately adjacent seats, consider the first seat in each of those eight directions. For example, the empty seat below would see eight occupied seats:

.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....

The leftmost empty seat below would only see one empty seat, but cannot see any of the occupied ones:

.............
.L.L.#.#.#.#.
.............

The empty seat below would see no occupied seats:

.##.##.
#.#.#.#
##...##
...L...
##...##
#.#.#.#
.##.##.

Also, people seem to be more tolerant than you expected: it now takes five or more visible occupied seats for an occupied seat to become empty (rather than four or more from the previous rules). The other rules still apply: empty seats that see no occupied seats become occupied, seats matching no rule don't change, and floor never changes.

Given the same starting layout as above, these new rules cause the seating area to shift around as follows:

L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL

#.##.##.##
#######.##
#.#.#..#..
####.##.##
#.##.##.##
#.#####.##
..#.#.....
##########
#.######.#
#.#####.##

#.LL.LL.L#
#LLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLLL.L
#.LLLLL.L#

#.L#.##.L#
#L#####.LL
L.#.#..#..
##L#.##.##
#.##.#L.##
#.#####.#L
..#.#.....
LLL####LL#
#.L#####.L
#.L####.L#

#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##LL.LL.L#
L.LL.LL.L#
#.LLLLL.LL
..L.L.....
LLLLLLLLL#
#.LLLLL#.L
#.L#LL#.L#

#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.#L.L#
#.L####.LL
..#.#.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#

#.L#.L#.L#
#LLLLLL.LL
L.L.L..#..
##L#.#L.L#
L.L#.LL.L#
#.LLLL#.LL
..#.L.....
LLL###LLL#
#.LLLLL#.L
#.L#LL#.L#

Again, at this point, people stop shifting around and the seating area reaches equilibrium. Once this occurs, you count 26 occupied seats.

Given the new visibility method and the rule change for occupied seats becoming empty, once equilibrium is reached, how many seats end up occupied?

Your puzzle answer was 2124.
 */
