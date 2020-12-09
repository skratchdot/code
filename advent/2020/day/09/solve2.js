const { run } = require('../lib');

const solve = (lines, find) => {
  lines = lines.map(parseFloat);
  for (let i = 0; i < lines.length; i++) {
    let sums = [lines[i]];
    let sum = lines[i];
    for (let j = i + 1; j < lines.length; j++) {
      sums.push(lines[j]);
      sum += lines[j];
      //console.log(i, j, sum, sums);
      if (sum === find) {
        return Math.min(...sums) + Math.max(...sums);
      } else if (sum > find) {
        j = lines.length;
      }
    }
  }
};

run(__dirname, 'inputtest', solve, 62, [127]);
run(__dirname, 'input', solve, 1261309, [10884537]);
