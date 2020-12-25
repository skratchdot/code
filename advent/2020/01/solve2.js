const { debug, run } = require('../../lib');

const solve2 = (lines, expectSum) => {
  const nums = lines.map(parseFloat);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k];
        if (sum === 2020) {
          const product = nums[i] * nums[j] * nums[k];
          debug(
            `nums[${i}] * nums[${j}] * nums[${k}] = ${nums[i]} * ${nums[j]} * ${nums[k]} = ${product}`
          );
          return product;
        }
      }
    }
  }
};

run(__dirname, 'inputtest', solve2, 241861950);
run(__dirname, 'input', solve2, 100655544);

/*
--- Part Two ---

The Elves in accounting are thankful for your help; one of them even offers you a starfish coin they had left over from a past vacation. They offer you a second one if you can find three numbers in your expense report that meet the same criteria.

Using the above example again, the three entries that sum to 2020 are 979, 366, and 675. Multiplying them together produces the answer, 241861950.

In your expense report, what is the product of the three entries that sum to 2020?

Your puzzle answer was 100655544.
*/
