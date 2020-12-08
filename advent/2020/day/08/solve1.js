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
  while (1) {
    const { executed, op, value } = instructions[i];
    if (executed) {
      return acc;
    } else {
      instructions[i].executed = true;
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
};

assert.deepEqual(solve(testLines), 5);
assert.deepEqual(solve(lines), 1810);
