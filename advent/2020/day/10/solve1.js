const { debug, run } = require('../lib');

const solve = (lines) => {
  lines = lines.map(parseFloat).sort((a, b) => a - b);
  // 3 higher than the last
  lines.push(lines[lines.length - 1] + 3);
  const allowedDiffs = [1, 2, 3].map((diff) => ({
    diff,
    count: 0,
    results: [],
  }));
  const skippedResults = [];
  let joltage = 0;

  debug(lines);

  for (let i = 0; i < lines.length; i++) {
    let skipped = true;
    for (let j = 0; j < allowedDiffs.length; j++) {
      debug(lines[i], '===', allowedDiffs[j].diff, '+', joltage);
      if (lines[i] === allowedDiffs[j].diff + joltage) {
        allowedDiffs[j].count++;
        allowedDiffs[j].results.push(lines[i]);
        joltage = lines[i];
        skipped = false;
        j = allowedDiffs.length;
        debug('found:', lines[i]);
      }
    }
    if (skipped) {
      skippedResults.push(lines[i]);
    }
  }

  debug({ allowedDiffs, skippedResults, joltage });
  return allowedDiffs[0].results.length * allowedDiffs[2].results.length;
};

run(__dirname, 'inputtest', solve, 7 * 5);
run(__dirname, 'inputtest2', solve, 22 * 10);
run(__dirname, 'input', solve, 2376);
