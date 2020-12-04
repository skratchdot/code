const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input`, 'utf8').trim().split('\n');

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
console.log(count);
