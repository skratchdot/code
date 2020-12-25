const { debug, run } = require('../../lib');
const assert = require('assert');

const solve2 = (lines) => {
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

  // first try LOL
  const sorted = lines.map(getSeat).sort((a, b) => a[2] - b[2]);
  for (let i = 1; i < sorted.length - 1; i++) {
    const prev = sorted[i - 1][2];
    const curr = sorted[i][2];
    const next = sorted[i + 1][2];
    if (prev !== curr - 1) {
      debug(sorted[i]);
    }
    if (next !== curr + 1) {
      debug(sorted[i]);
    }
  }

  // second try LOL
  const minId = sorted[0][2];
  const maxId = sorted[sorted.length - 1][2];
  const map = new Map();
  sorted.forEach((v) => map.set(v[2], v));
  for (let id = minId; id <= maxId; id++) {
    if (!map.has(id) && map.has(id - 1) && map.has(id + 1)) {
      debug(`my id is ${id}`);
      return id;
    }
  }
};

run(__dirname, 'input', solve2, 642);

/*
--- Part Two ---

Ding! The "fasten seat belt" signs have turned on. Time to find your seat.

It's a completely full flight, so your seat should be the only missing boarding pass in your list. However, there's a catch: some of the seats at the very front and back of the plane don't exist on this aircraft, so they'll be missing from your list as well.

Your seat wasn't at the very front or back, though; the seats with IDs +1 and -1 from yours will be in your list.

What is the ID of your seat?

Your puzzle answer was 642.
*/
