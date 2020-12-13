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

/*
--- Day 2: Password Philosophy ---

Your flight departs in a few days from the coastal airport; the easiest way down to the coast from here is via toboggan.

The shopkeeper at the North Pole Toboggan Rental Shop is having a bad day. "Something's wrong with our computers; we can't log in!" You ask if you can take a look.

Their password database seems to be a little corrupted: some of the passwords wouldn't have been allowed by the Official Toboggan Corporate Policy that was in effect when they were chosen.

To try to debug the problem, they have created a list (your puzzle input) of passwords (according to the corrupted database) and the corporate policy when that password was set.

For example, suppose you have the following list:

1-3 a: abcde
1-3 b: cdefg
2-9 c: ccccccccc

Each line gives the password policy and then the password. The password policy indicates the lowest and highest number of times a given letter must appear for the password to be valid. For example, 1-3 a means that the password must contain a at least 1 time and at most 3 times.

In the above example, 2 passwords are valid. The middle password, cdefg, is not; it contains no instances of b, but needs at least 1. The first and third passwords are valid: they contain one a or nine c, both within the limits of their respective policies.

How many passwords are valid according to their policies?

Your puzzle answer was 625.
*/
