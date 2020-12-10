const { debug, run, log } = require('../lib');

const solve = (lines) => {
  let result = 0;
  lines = lines.map(parseFloat).sort((a, b) => a - b);
  // last value is 3 higher than the last input
  const lastValue = lines[lines.length - 1] + 3;
  lines.push(lastValue);

  const buildTree = (joltage, index) => {
    let i = index;
    while (lines[i] <= joltage + 3) {
      buildTree(
        lines[i],
        i + 1
      );
      i++;
    }
    if (joltage === lastValue) {
      result++;
    }
  };

  let joltage = 0;
  buildTree(joltage, 0);
  return result;
};

run(__dirname, 'inputtest', solve, 8);
run(__dirname, 'inputtest2', solve, 19208);
//run(__dirname, 'input', solve, 0);
