const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input`, 'utf8').trim().split('\n');
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

console.log(misses);
console.log(matches);
console.log(`There are ${matches.length} matches and ${misses.length} misses`);
