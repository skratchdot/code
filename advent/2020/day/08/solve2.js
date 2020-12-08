const assert = require('assert');
const fs = require('fs');

const lines = fs.readFileSync(`${__dirname}/input`, 'utf8').trim().split('\n');

const testLines = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`.split('\n');

const solve = (lines) => {
  let change = -1;
  while (change < lines.length) {
    try {
      const result = solveHelper(lines, change);
      return result;
    } catch (err) {}
    change++;
  }
};

const solveHelper = (lines, change) => {
  const instructions = lines.map((line) => {
    const [op, val] = line.split(' ');
    return {
      executed: false,
      op,
      value: parseFloat(val),
    };
  });
  let acc = 0;
  let i = 0;
  while (i !== lines.length) {
    let { executed, op, value } = instructions[i];
    if (executed) {
      throw new Error('infinite loop');
    } else {
      instructions[i].executed = true;
      if (change === i && op === 'nop') {
        op = 'jmp';
      }
      if (change === i && op === 'jmp') {
        op = 'nop';
      }

      if (op === 'nop') {
        i++;
      } else if (op === 'acc') {
        i++;
        acc += value;
      } else if (op === 'jmp') {
        i += value;
      }
    }
  }
  return acc;
};

assert.deepEqual(solve(testLines), 8);
assert.deepEqual(solve(lines), 969);
