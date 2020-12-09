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
