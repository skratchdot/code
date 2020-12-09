const { debug, run } = require('../lib');

const solve1 = (lines, expectSum) => {
  const nums = lines.map(parseFloat);
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      const sum = nums[i] + nums[j];
      if (sum === 2020) {
        const product = nums[i] * nums[j];
        debug(`nums[${i}] * nums[${j}] = ${nums[i]} * ${nums[j]} = ${product}`);
        return product;
      }
    }
  }
};

run(__dirname, 'inputtest', solve1, 514579);
run(__dirname, 'input', solve1, 1019571);
