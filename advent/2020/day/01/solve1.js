const fs = require('fs');

const nums = fs
  .readFileSync(`${__dirname}/input`, 'utf8')
  .trim()
  .split('\n')
  .map(parseFloat);

for (let i = 0; i < nums.length; i++) {
  for (let j = i + 1; j < nums.length; j++) {
    if (nums[i] + nums[j] === 2020) {
      console.log(
        `nums[${i}] * nums[${j}] = ${nums[i]} * ${nums[j]} = `,
        nums[i] * nums[j]
      );
    }
  }
}
