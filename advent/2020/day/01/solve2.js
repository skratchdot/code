const { debug, run } = require('../lib');

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
