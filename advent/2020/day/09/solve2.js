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

/*
--- Part Two ---

The final step in breaking the XMAS encryption relies on the invalid number you just found: you must find a contiguous set of at least two numbers in your list which sum to the invalid number from step 1.

Again consider the above example:

35
20
15
25
47
40
62
55
65
95
102
117
150
182
127
219
299
277
309
576

In this list, adding up all of the numbers from 15 through 40 produces the invalid number from step 1, 127. (Of course, the contiguous set of numbers in your actual list might be much longer.)

To find the encryption weakness, add together the smallest and largest number in this contiguous range; in this example, these are 15 and 47, producing 62.

What is the encryption weakness in your XMAS-encrypted list of numbers?

Your puzzle answer was 1261309.
*/
