const { run } = require('../lib');

const solve2 = (lines) => {
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

run(__dirname, 'inputtest', solve2, 8);
run(__dirname, 'input', solve2, 969);
