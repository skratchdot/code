const { debug, run } = require('../lib');

const solve = (lines, preambleSize) => {
  lines = lines.map(parseFloat);
  const preamble = [];
  let sums = [];
  const fillPreamble = () => {
    if (lines.length) {
      preamble.shift();
      preamble.push(lines.shift());
    }
    while (preamble.length < preambleSize && lines.length) {
      preamble.push(lines.shift());
    }
    while (preamble > preambleSize) {
      preamble.shift();
    }
  };
  const buildSums = () => {
    sums = [];
    for (let i = 0; i < preamble.length; i++) {
      for (let j = i + 1; j < preamble.length; j++) {
        sums.push(preamble[i] + preamble[j]);
      }
    }
  };
  while (lines.length) {
    fillPreamble();
    buildSums();
    debug({ line: lines[0], preamble, sums });
    if (!sums.includes(lines[0])) {
      return lines[0];
    }
  }
};

run(__dirname, 'inputtest', solve, 127, { args: [5] });
run(__dirname, 'input', solve, 10884537, { args: [25] });
