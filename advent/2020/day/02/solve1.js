const { debug, run } = require('../lib');

const solve1 = (lines) => {
  const matches = [];
  const misses = [];

  const count = (str, letter) => {
    let num = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === letter) {
        num++;
      }
    }
    return num;
  };

  lines.forEach((line) => {
    const [rule, password, ...args] = line.split(': ');
    if (args.length) {
      throw new Error('Password contains semicolon');
    }
    const [values, letter] = rule.split(' ');
    const [min, max] = values.split('-').map(parseFloat);
    const theCount = count(password, letter);
    const data = { line, min, max, letter, rule, password, theCount };
    if (theCount >= min && theCount <= max) {
      matches.push(data);
    } else {
      misses.push(data);
    }
  });

  debug(misses);
  debug(matches);
  debug(`There are ${matches.length} matches and ${misses.length} misses`);
  return matches.length;
};

run(__dirname, 'inputtest', solve1, 2);
run(__dirname, 'input', solve1, 625);
