const assert = require('assert');
const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input`, 'utf8').trim().split('\n');

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

assert.deepEqual(getSeat('FBFBBFFRLR'), [44, 5, 357]);
assert.deepEqual(getSeat('BFFFBBFRRR'), [70, 7, 567]);
assert.deepEqual(getSeat('FFFBBBFRRR'), [14, 7, 119]);
assert.deepEqual(getSeat('BBFFBBFRLL'), [102, 4, 820]);

// first try LOL
const sorted = lines.map(getSeat).sort((a, b) => a[2] - b[2]);
for (let i = 1; i < sorted.length - 1; i++) {
  const prev = sorted[i - 1][2];
  const curr = sorted[i][2];
  const next = sorted[i + 1][2];
  if (prev !== curr - 1) {
    console.log(sorted[i]);
  }
  if (next !== curr + 1) {
    console.log(sorted[i]);
  }
}

// second try LOL
const minId = sorted[0][2];
const maxId = sorted[sorted.length - 1][2];
const map = new Map();
sorted.forEach((v) => map.set(v[2], v));
for (let id = minId; id <= maxId; id++) {
  if (!map.has(id) && map.has(id - 1) && map.has(id + 1)) {
    console.log(`my id is ${id}`);
  }
}
