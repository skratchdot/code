const { debug, run } = require('../lib');

/**
 * I saw this idea in slack and it was too good not to try myself.
 * The function generates a wolframalpha search string you can enter
 * in their search engine. i'm too lazy to have it fetch the results
 * for me, so this is a manual process.
 */
const solveWolfram = (lines) => {
  const [_, idString] = lines;
  let result =
    'Enter the following line into https://www.wolframalpha.com/:\n\n';
  let firstPrinted = false;
  idString.split(',').forEach((val, index) => {
    if (val !== 'x') {
      if (firstPrinted) {
        result += ', ';
      }
      firstPrinted = true;
      result += `(t + ${index}) mod ${val} = 0`;
    }
  });
  return result;
};

run(
  __dirname,
  'inputtest',
  solveWolfram,
  `Enter the following line into https://www.wolframalpha.com/:

(t + 0) mod 7 = 0, (t + 1) mod 13 = 0, (t + 4) mod 59 = 0, (t + 6) mod 31 = 0, (t + 7) mod 19 = 0`
);

run(
  __dirname,
  'input',
  solveWolfram,
  `Enter the following line into https://www.wolframalpha.com/:

(t + 0) mod 29 = 0, (t + 19) mod 41 = 0, (t + 29) mod 521 = 0, (t + 37) mod 23 = 0, (t + 42) mod 13 = 0, (t + 46) mod 17 = 0, (t + 60) mod 601 = 0, (t + 66) mod 37 = 0, (t + 79) mod 19 = 0`
);
