const assert = require('assert');
const fs = require('fs');
const path = require('path');
const util = require('util');
const debug = require('debug')('aoc');

const log = (...args) =>
  console.log(
    ...args.map((arg) => util.inspect(arg, { depth: null, colors: true }))
  );

const run = (dir, name, fn, expected, options = {}) => {
  const { args = [], split = '\n' } = options;
  const lines = fs
    .readFileSync(path.resolve(dir, name), 'utf8')
    .trim()
    .split(split);
  const result = fn(lines, ...args);
  log(fn.name, name, result);
  assert.deepStrictEqual(result, expected);
};

module.exports = {
  log,
  run,
  debug,
};
