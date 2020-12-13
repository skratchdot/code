const { debug, run, log } = require('../lib');

/*

step 1: convert list into arrays of "children indexes"
0  [1]      
1  [4]      
4  [5,6,7]     length=3 sameAsNext=2
5  [6,7]       length=2 sameAsNext=1
6  [7]
7  [10]
10 [11,12]     length=2 sameAsNext=1
11 [12]
12 [15]
15 [16]
16 [19]
19 [22]
22

step 2: start from bottom and replace each "index" in the array with the "actual count of leaf nodes".
then sum the values in the array for an actual "count of leaf nodes" for the given line
0  [8]     = 8
1  [8]     = 8 
4  [4,2,2] = 8
5  [2,2]   = 4
6  [2]     = 2
7  [2]     = 2
10 [1,1]   = 2
11 [1]     = 1
12 [1]     = 1
15 [1]     = 1
16 [1]     = 1
19 [1]     = 1
22 1

*/
const solve2 = (lines) => {
  lines = lines.map(parseFloat).sort((a, b) => a - b);

  // first value is 0 and last value is 3 higher than the last input
  const lastValue = lines[lines.length - 1] + 3;
  lines = [0, ...lines, lastValue];

  // step 1: loop through each item in the list, and build an array of the children indexes
  const childrenIndexes = lines.map((value, index) => {
    const children = [];
    let childIndex = index + 1;
    while (lines[childIndex] <= value + 3) {
      children.push(lines[childIndex]);
      childIndex++;
    }
    return { index, value, children, length: children.length };
  });

  // step 2: starting from the back of the list, give each index a "counted" value
  const mappedCounts = {};
  childrenIndexes.reverse().forEach(({ children, value }) => {
    if (children.length === 0) {
      mappedCounts[value] = 1;
    } else {
      mappedCounts[value] = children
        .map((v) => mappedCounts[v])
        .reduce((a, b) => a + b, 0);
    }
  });

  // result and debugging
  const result = mappedCounts[0];
  debug({ childrenIndexes, result, mappedCounts });
  return result;
};

run(__dirname, 'inputtest', solve2, 8);
run(__dirname, 'inputtest2', solve2, 19208);
run(__dirname, 'input', solve2, 129586085429248);

/*
--- Part Two ---

To completely determine whether you have enough adapters, you'll need to figure out how many different ways they can be arranged. Every arrangement needs to connect the charging outlet to your device. The previous rules about when adapters can successfully connect still apply.

The first example above (the one that starts with 16, 10, 15) supports the following arrangements:

(0), 1, 4, 5, 6, 7, 10, 11, 12, 15, 16, 19, (22)
(0), 1, 4, 5, 6, 7, 10, 12, 15, 16, 19, (22)
(0), 1, 4, 5, 7, 10, 11, 12, 15, 16, 19, (22)
(0), 1, 4, 5, 7, 10, 12, 15, 16, 19, (22)
(0), 1, 4, 6, 7, 10, 11, 12, 15, 16, 19, (22)
(0), 1, 4, 6, 7, 10, 12, 15, 16, 19, (22)
(0), 1, 4, 7, 10, 11, 12, 15, 16, 19, (22)
(0), 1, 4, 7, 10, 12, 15, 16, 19, (22)

(The charging outlet and your device's built-in adapter are shown in parentheses.) Given the adapters from the first example, the total number of arrangements that connect the charging outlet to your device is 8.

The second example above (the one that starts with 28, 33, 18) has many arrangements. Here are a few:

(0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 48, 49, (52)

(0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
32, 33, 34, 35, 38, 39, 42, 45, 46, 47, 49, (52)

(0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
32, 33, 34, 35, 38, 39, 42, 45, 46, 48, 49, (52)

(0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
32, 33, 34, 35, 38, 39, 42, 45, 46, 49, (52)

(0), 1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 17, 18, 19, 20, 23, 24, 25, 28, 31,
32, 33, 34, 35, 38, 39, 42, 45, 47, 48, 49, (52)

(0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
46, 48, 49, (52)

(0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
46, 49, (52)

(0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
47, 48, 49, (52)

(0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
47, 49, (52)

(0), 3, 4, 7, 10, 11, 14, 17, 20, 23, 25, 28, 31, 34, 35, 38, 39, 42, 45,
48, 49, (52)

In total, this set of adapters can connect the charging outlet to your device in 19208 distinct arrangements.

You glance back down at your bag and try to remember why you brought so many adapters; there must be more than a trillion valid ways to arrange them! Surely, there must be an efficient way to count the arrangements.

What is the total number of distinct ways you can arrange the adapters to connect the charging outlet to your device?

Your puzzle answer was 129586085429248.
*/
