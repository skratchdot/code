const assert = require('assert');
const fs = require('fs');
const path = require('path');

const log = (...args) =>
  console.log(
    ...args.map((arg) => util.inspect(arg, { depth: null, colors: true }))
  );

const run = (dir, name, fn, expected) => {
  const lines = fs
    .readFileSync(path.resolve(dir, name), 'utf8')
    .trim()
    .split('\n');
  const result = fn(lines);
  assert.deepStrictEqual(result, expected);
};

module.exports = {
  log,
  run,
};
