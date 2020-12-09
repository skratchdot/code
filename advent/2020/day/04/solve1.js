const { debug, run } = require('../lib');

const solve1 = (lines) => {
  const required = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];

  let count = 0;
  let current = new Set();

  const check = () => {
    for (let i = 0; i < required.length; i++) {
      if (!current.has(required[i])) {
        return;
      }
    }
    count++;
  };

  lines.forEach((line) => {
    const keys = line
      .split(/\s+/)
      .map((v) => v.split(':')[0])
      .filter((v) => v);
    keys.forEach((v) => current.add(v));
    // new passport
    if (keys.length === 0) {
      check();
      current = new Set();
    }
  });
  check();
  debug({ count });
  return count;
};

run(__dirname, 'inputtest', solve1, 2);
run(__dirname, 'input', solve1, 216);
