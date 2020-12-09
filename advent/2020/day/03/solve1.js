const { debug, run } = require('../lib');

const solve1 = (lines) => {
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
    moveRight();
    moveRight();
    moveRight();
    y++;
    check();
  }

  debug({ trees });
  return trees;
};

run(__dirname, 'inputtest', solve1, 7);
run(__dirname, 'input', solve1, 148);
