const { debug, run } = require('../lib');

const solve2 = (lines, find) => {
  lines = lines.map(parseFloat);
  for (let i = 0; i < lines.length; i++) {
    let sums = [lines[i]];
    let sum = lines[i];
    for (let j = i + 1; j < lines.length; j++) {
      sums.push(lines[j]);
      sum += lines[j];
      debug(i, j, sum, sums);
      if (sum === find) {
        return Math.min(...sums) + Math.max(...sums);
      } else if (sum > find) {
        j = lines.length;
      }
    }
  }
};

run(__dirname, 'inputtest', solve2, 62, { args: [127] });
run(__dirname, 'input', solve2, 1261309, { args: [10884537] });
