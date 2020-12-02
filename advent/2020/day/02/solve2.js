const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input`, 'utf8').trim().split('\n');
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

console.log(misses);
console.log(matches);
console.log(`There are ${matches.length} matches and ${misses.length} misses`);
