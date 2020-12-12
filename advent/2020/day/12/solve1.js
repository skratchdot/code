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

const solve = (lines) => {
  let east = 0;
  let north = 0;
  let dir = DIR_EAST;

  lines.forEach((line) => {
    const [instruction, ...rest] = line.split('');
    let val = parseFloat(rest.join(''));
    debug({ east, north, dir, line, instruction, val });
    switch (instruction) {
      case 'N':
        north += val;
        break;
      case 'S':
        north -= val;
        break;
      case 'E':
        east += val;
        break;
      case 'W':
        east -= val;
        break;
      case 'L':
        while (val > 0) {
          if (dir === DIR_EAST) {
            dir = DIR_NORTH;
          } else if (dir === DIR_NORTH) {
            dir = DIR_WEST;
          } else if (dir === DIR_WEST) {
            dir = DIR_SOUTH;
          } else if (dir === DIR_SOUTH) {
            dir = DIR_EAST;
          }
          val -= 90;
        }
        break;
      case 'R':
        while (val > 0) {
          if (dir === DIR_EAST) {
            dir = DIR_SOUTH;
          } else if (dir === DIR_SOUTH) {
            dir = DIR_WEST;
          } else if (dir === DIR_WEST) {
            dir = DIR_NORTH;
          } else if (dir === DIR_NORTH) {
            dir = DIR_EAST;
          }
          val -= 90;
        }
        break;
      case 'F':
        if (dir === DIR_EAST) {
          east += val;
        } else if (dir === DIR_NORTH) {
          north += val;
        } else if (dir === DIR_SOUTH) {
          north -= val;
        } else if (dir === DIR_WEST) {
          east -= val;
        }
        break;
    }
  });
  return Math.abs(east) + Math.abs(north);
};

run(__dirname, 'inputtest', solve, 25);
run(__dirname, 'input', solve, 381);
