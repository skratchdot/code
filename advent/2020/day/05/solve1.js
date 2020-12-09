const { debug, run } = require('../lib');
const assert = require('assert');

const solve1 = (lines) => {
  const builder = (data, min, max, pow, lowerLetter) => {
    while (pow >= 0) {
      const val = Math.pow(2, pow);
      if (data.shift() === lowerLetter) {
        max -= val;
      } else {
        min += val;
      }
      pow--;
    }
    if (min !== max) {
      throw new Error(`min=${min} not equal to max=${max}`);
    }
    return min;
  };

  const getSeat = (str) => {
    const data = str.split('');
    const row = builder(data, 0, 127, 6, 'F');
    const col = builder(data, 0, 7, 2, 'L');
    return [row, col, row * 8 + col];
  };
  assert.deepStrictEqual(getSeat('FBFBBFFRLR'), [44, 5, 357]);
  assert.deepStrictEqual(getSeat('BFFFBBFRRR'), [70, 7, 567]);
  assert.deepStrictEqual(getSeat('FFFBBBFRRR'), [14, 7, 119]);
  assert.deepStrictEqual(getSeat('BBFFBBFRLL'), [102, 4, 820]);

  const max = Math.max(...lines.map(getSeat).map((v) => v[2]));
  debug({ max });
  return max;
};

run(__dirname, 'inputtest', solve1, 820);
run(__dirname, 'input', solve1, 919);
