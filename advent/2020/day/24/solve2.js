const { debug, run } = require('../lib');

const directions = {
  e: ([x, y]) => [x + 2, y],
  w: ([x, y]) => [x - 2, y],
  se: ([x, y]) => [x + 1, y - 2],
  sw: ([x, y]) => [x - 1, y - 2],
  ne: ([x, y]) => [x + 1, y + 2],
  nw: ([x, y]) => [x - 1, y + 2],
};

const solve2 = (lines, numDays) => {
  let map = {};
  lines.forEach((line) => {
    let x = 0;
    let y = 0;
    let i = 0;
    while (i < line.length) {
      const one = line.substr(i, 1);
      if (directions.hasOwnProperty(one)) {
        i += 1;
        [x, y] = directions[one]([x, y]);
      } else {
        const two = line.substr(i, 2);
        i += 2;
        [x, y] = directions[two]([x, y]);
      }
    }
    const key = [x, y].toString();
    map[key] = !map[key];
  });

  const countAdjacent = (map, x, y) => {
    let count = 0;
    const adjacent = getAdjacent(x, y);
    adjacent.forEach(([x, y]) => {
      const key = [x, y].toString();
      if (!!map[key]) {
        count++;
      }
    });
    return count;
  };

  const getAdjacent = (x, y) => {
    const adjacent = [];
    Object.keys(directions).forEach((direction) => {
      adjacent.push(directions[direction]([x, y]));
    });
    return adjacent;
  };

  const getNeighbors = (inputMap) => {
    const resultMap = {};
    Object.keys(inputMap).forEach((key) => {
      const isBlack = !!inputMap[key];
      // since the rules only flip based on the black tiles,
      // we only need to get adjacent tiles to black tiles
      if (isBlack) {
        // add ourself
        resultMap[key] = inputMap[key];

        // add adjacent tiles
        const [x, y] = key.split(',').map(parseFloat);
        const adjacent = getAdjacent(x, y);
        adjacent.forEach(([x, y]) => {
          const key = [x, y].toString();
          resultMap[key] = !!inputMap[key];
        });
      }
    });
    return resultMap;
  };

  const flipTiles = (inputMap) => {
    const resultMap = {};

    const neighborMap = getNeighbors(inputMap);

    // now flip all the neighbors and add them to our
    Object.keys(neighborMap).forEach((key) => {
      let outputIsBlack = false;
      const inputIsBlack = !!neighborMap[key];
      const [x, y] = key.split(',').map(parseFloat);
      const adjacent = countAdjacent(neighborMap, x, y);
      if (inputIsBlack) {
        // Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
        if (adjacent === 1 || adjacent === 2) {
          outputIsBlack = true;
        }
      } else {
        // Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
        if (adjacent === 2) {
          outputIsBlack = true;
        }
      }
      // we only need to add the "black" tiles
      if (outputIsBlack) {
        resultMap[key] = true;
      }
    });
    return resultMap;
  };

  let day = 1;
  let numBlack = 0;
  while (day <= numDays) {
    map = flipTiles(map);
    numBlack = Object.keys(map).filter((key) => map[key]).length;
    debug(`Day ${day}: ${numBlack}`);
    day++;
  }

  return Object.keys(map).filter((key) => map[key]).length;
};

run(__dirname, 'inputtest', solve2, 2208, { args: [100] });
run(__dirname, 'input', solve2, 3665, { args: [100] });

/*
--- Part Two ---

The tile floor in the lobby is meant to be a living art exhibit. Every day, the tiles are all flipped according to the following rules:

    Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
    Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.

Here, tiles immediately adjacent means the six tiles directly touching the tile in question.

The rules are applied simultaneously to every tile; put another way, it is first determined which tiles need to be flipped, then they are all flipped at the same time.

In the above example, the number of black tiles that are facing up after the given number of days has passed is as follows:

Day 1: 15
Day 2: 12
Day 3: 25
Day 4: 14
Day 5: 23
Day 6: 28
Day 7: 41
Day 8: 37
Day 9: 49
Day 10: 37

Day 20: 132
Day 30: 259
Day 40: 406
Day 50: 566
Day 60: 788
Day 70: 1106
Day 80: 1373
Day 90: 1844
Day 100: 2208

After executing this process a total of 100 times, there would be 2208 black tiles facing up.

How many tiles will be black after 100 days?

Your puzzle answer was 3665.
 */
