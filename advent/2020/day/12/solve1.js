const { debug, run } = require('../lib');

/*
  Action N means to move north by the given value.
  Action S means to move south by the given value.
  Action E means to move east by the given value.
  Action W means to move west by the given value.
  Action L means to turn left the given number of degrees.
  Action R means to turn right the given number of degrees.
  Action F means to move forward by the given value in the direction the
*/

const DIR_EAST = 'east';
const DIR_NORTH = 'north';
const DIR_WEST = 'west';
const DIR_SOUTH = 'south';
const COUNTER_CLOCKWISE = [DIR_EAST, DIR_NORTH, DIR_WEST, DIR_SOUTH];
const CLOCKWISE = [DIR_EAST, DIR_SOUTH, DIR_WEST, DIR_NORTH];

const turn = (arr, dir, val) => {
  while (val > 0) {
    dir = arr[(arr.indexOf(dir) + 1) % arr.length];
    val -= 90;
  }
  if (val !== 0) {
    throw new Error('you can only turn in increments of 90 degrees');
  }
  return dir;
};

const solve = (lines) => {
  // instance variables
  let east = 0;
  let north = 0;
  let dir = DIR_EAST;
  // execute all instructions
  lines.forEach((line) => {
    const [instruction, ...rest] = line.split('');
    let val = parseFloat(rest.join(''));
    debug({ east, north, dir, line, instruction, val });
    const moveForwardMap = {
      [DIR_EAST]: () => (east += val),
      [DIR_NORTH]: () => (north += val),
      [DIR_SOUTH]: () => (north -= val),
      [DIR_WEST]: () => (east -= val),
    };
    const instructionMap = {
      N: () => (north += val),
      S: () => (north -= val),
      E: () => (east += val),
      W: () => (east -= val),
      L: () => (dir = turn(COUNTER_CLOCKWISE, dir, val)),
      R: () => (dir = turn(CLOCKWISE, dir, val)),
      F: () => moveForwardMap[dir](),
    };
    instructionMap[instruction]();
  });
  return Math.abs(east) + Math.abs(north);
};

run(__dirname, 'inputtest', solve, 25);
run(__dirname, 'input', solve, 381);
