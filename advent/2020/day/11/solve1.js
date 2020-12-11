const { debug, run } = require('../lib');

/*
    If a seat is empty (L) and there are no occupied seats adjacent to it, the seat becomes occupied.
    If a seat is occupied (#) and four or more seats adjacent to it are also occupied, the seat becomes empty.
    Otherwise, the seat's state does not change.
*/

const isFree = (grid, row, col) => {
  try {
    return grid[row][col] !== '#';
  } catch (err) {}
  return true;
};

const isSeated = (grid, row, col) => {
  try {
    return grid[row][col] === '#';
  } catch (err) {}
  return false;
};

const isNotOccupied = (grid, row, col) =>
  isFree(grid, row - 1, col - 1) &&
  isFree(grid, row, col - 1) &&
  isFree(grid, row + 1, col - 1) &&
  isFree(grid, row - 1, col) &&
  isFree(grid, row + 1, col) &&
  isFree(grid, row - 1, col + 1) &&
  isFree(grid, row, col + 1) &&
  isFree(grid, row + 1, col + 1);

const isOccupied = (grid, row, col) => {
  let numSeats = 0;
  numSeats += isSeated(grid, row - 1, col - 1) ? 1 : 0;
  numSeats += isSeated(grid, row, col - 1) ? 1 : 0;
  numSeats += isSeated(grid, row + 1, col - 1) ? 1 : 0;
  numSeats += isSeated(grid, row - 1, col) ? 1 : 0;
  numSeats += isSeated(grid, row + 1, col) ? 1 : 0;
  numSeats += isSeated(grid, row - 1, col + 1) ? 1 : 0;
  numSeats += isSeated(grid, row, col + 1) ? 1 : 0;
  numSeats += isSeated(grid, row + 1, col + 1) ? 1 : 0;
  return numSeats >= 4;
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

const solve = (lines) => {
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

run(__dirname, 'inputtest', solve, 37);
run(__dirname, 'input', solve, 2368);
