const { debug, run } = require('../lib');

const solve2 = (lines) => {
  const solve = (numRight, numDown) => {
    let y = 0;
    let x = 0;
    let trees = 0;
    let line;
    const check = () => {
      if (y <= lines.length - 1) {
        line = lines[y];
        if (line[x] === '#') {
          trees++;
        }
      }
    };
    const moveRight = () => {
      if (x === line.length - 1) {
        x = 0;
      } else {
        x++;
      }
    };
    while (y <= lines.length - 1) {
      line = lines[y];
      for (let i = 0; i < numRight; i++) {
        moveRight();
      }
      for (let j = 0; j < numDown; j++) {
        y++;
      }
      check();
    }
    debug({ numRight, numDown, trees });
    return trees;
  };

  return solve(1, 1) * solve(3, 1) * solve(5, 1) * solve(7, 1) * solve(1, 2);
};

run(__dirname, 'inputtest', solve2, 336);
run(__dirname, 'input', solve2, 727923200);

/*
--- Part Two ---

Time to check the rest of the slopes - you need to minimize the probability of a sudden arboreal stop, after all.

Determine the number of trees you would encounter if, for each of the following slopes, you start at the top-left corner and traverse the map all the way to the bottom:

    Right 1, down 1.
    Right 3, down 1. (This is the slope you already checked.)
    Right 5, down 1.
    Right 7, down 1.
    Right 1, down 2.

In the above example, these slopes would find 2, 7, 3, 4, and 2 tree(s) respectively; multiplied together, these produce the answer 336.

What do you get if you multiply together the number of trees encountered on each of the listed slopes?

Your puzzle answer was 727923200.
*/
