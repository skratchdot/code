const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input`, 'utf8').trim().split('\n');

const isFourDigits = (v) => /^\d{4}$/.test(v);
const isAtLeast = (v, val) => parseFloat(v) >= val;
const isAtMost = (v, val) => parseFloat(v) <= val;
const isCm = (v) => /^\d+cm$/.test(v) && isAtLeast(v, 150) && isAtMost(v, 193);
const isIn = (v) => /^\d+in$/.test(v) && isAtLeast(v, 59) && isAtMost(v, 76);

const required = [
  ['byr', (v) => isFourDigits(v) && isAtLeast(v, 1920) && isAtMost(v, 2002)],
  ['iyr', (v) => isFourDigits(v) && isAtLeast(v, 2010) && isAtMost(v, 2020)],
  ['eyr', (v) => isFourDigits(v) && isAtLeast(v, 2020) && isAtMost(v, 2030)],
  ['hgt', (v) => isCm(v) || isIn(v)],
  ['hcl', (v) => /^#[0-9a-f]{6}$/.test(v)],
  ['ecl', (v) => ['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(v)],
  ['pid', (v) => /^\d{9}$/.test(v)],
];

let count = 0;
let current = new Map();

const check = () => {
  for (let i = 0; i < required.length; i++) {
    const [key, fn] = required[i];
    if (!current.has(key)) {
      return;
    } else {
      const val = current.get(key);
      if (!fn(val)) {
        return;
      }
    }
  }
  count++;
  console.log(current);
};

lines.forEach((line) => {
  const keys = line
    .split(/\s+/)
    .filter((v) => v)
    .map((v) => v.split(':'));
  keys.forEach((v) => current.set(v[0], v[1]));
  // new passport
  if (keys.length === 0) {
    check();
    current = new Map();
  }
});
check();
console.log(count);
