const { debug, run } = require('../lib');

const solve2 = (lines, numTurns) => {
  const nums = lines[0].split(',').map(parseFloat);

  // instance vars
  const spoken = new Int32Array(numTurns).fill(-1);
  nums.forEach((num, i) => (spoken[num] = i));
  let lastSpoken = nums.slice(-1)[0];
  let turnNumber = nums.length - 1;

  while (turnNumber < numTurns - 1) {
    if (spoken[lastSpoken] !== -1) {
      // how many turns apart the number is from when it was previously spoken.
      const nowSpeak = turnNumber - spoken[lastSpoken];
      spoken[lastSpoken] = turnNumber;
      lastSpoken = nowSpeak;
    } else {
      // say zero
      spoken[lastSpoken] = turnNumber;
      lastSpoken = 0;
    }
    turnNumber++;
  }
  return lastSpoken;
};

run(__dirname, 'inputtest', solve2, 436, { args: [2020] });
run(__dirname, 'input', solve2, 447, { args: [2020] });
run(__dirname, 'inputtest', solve2, 175594, { args: [30000000] });
run(__dirname, 'input', solve2, 11721679, { args: [30000000] });

/*
--- Part Two ---

Impressed, the Elves issue you a challenge: determine the 30000000th number spoken. For example, given the same starting numbers as above:

    Given 0,3,6, the 30000000th number spoken is 175594.
    Given 1,3,2, the 30000000th number spoken is 2578.
    Given 2,1,3, the 30000000th number spoken is 3544142.
    Given 1,2,3, the 30000000th number spoken is 261214.
    Given 2,3,1, the 30000000th number spoken is 6895259.
    Given 3,2,1, the 30000000th number spoken is 18.
    Given 3,1,2, the 30000000th number spoken is 362.

Given your starting numbers, what will be the 30000000th number spoken?

Your puzzle answer was 11721679.
 */
