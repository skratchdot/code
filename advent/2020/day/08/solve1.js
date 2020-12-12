const { run } = require('../lib');

const solve1 = (lines) => {
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

run(__dirname, 'inputtest', solve1, 5);
run(__dirname, 'input', solve1, 1810);
