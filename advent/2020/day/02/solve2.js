const { debug, run } = require('../lib');

const solve2 = (lines) => {
  const matches = [];
  const misses = [];

  lines.forEach((line) => {
    const [rule, password, ...args] = line.split(': ');
    if (args.length) {
      throw new Error('Password contains semicolon');
    }
    const [values, letter] = rule.split(' ');
    const [one, two] = values.split('-').map(parseFloat);

    let positionMatches = 0;
    if (password[one - 1] === letter) {
      positionMatches++;
    }
    if (password[two - 1] === letter) {
      positionMatches++;
    }

    const data = { line, one, two, letter, rule, password, positionMatches };
    if (positionMatches === 1) {
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

run(__dirname, 'inputtest', solve2, 1);
run(__dirname, 'input', solve2, 391);
