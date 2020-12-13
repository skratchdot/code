const { debug, run } = require('../lib');

const solve2 = (lines) => {
  const bingo = 'shiny gold';
  const map = {};

  const clean = () => {
    let keepGoing = false;
    Object.keys(map).forEach((key) => {
      let items = map[key];
      if (Array.isArray(items)) {
        items = items.map((bag) => {
          return typeof map[bag] === 'number' ? map[bag] : bag;
        });
        if (items.every((v) => typeof v === 'number')) {
          items = items.reduce((prev, curr) => prev + curr, 1);
        } else if (items.some((v) => typeof map[v] !== 'number')) {
          keepGoing = true;
        }
        map[key] = items;
      }
    });
    return keepGoing;
  };

  lines.forEach((line) => {
    let [bag, rules] = line.replace(/\./gi, '').split(' contain ');
    const bagObjects = rules
      .split(', ')
      .filter((rule) => rule !== 'no other bags')
      .map((rule) => {
        const match = rule.match(/(\d+) (.*)$/);
        const num = parseFloat(match[1]);
        const bag = match[2].replace(/bags?/, '').trim();
        return { num, bag };
      });
    bag = bag.replace(/bags?/, '').trim();

    const bags = [];
    bagObjects.forEach(({ num, bag }) => {
      while (num-- > 0) {
        bags.push(bag);
      }
    });

    if (bags.length === 0) {
      map[bag] = 1;
    } else {
      map[bag] = bags;
    }
  });

  while (clean()) {}

  const bagsInside = map[bingo] - 1;
  debug({ map, bagsInside });
  return bagsInside;
};

run(__dirname, 'inputtest', solve2, 32);
run(__dirname, 'inputtest2', solve2, 126);
run(__dirname, 'input', solve2, 9569);

/*
--- Part Two ---

It's getting pretty expensive to fly these days - not because of ticket prices, but because of the ridiculous number of bags you need to buy!

Consider again your shiny gold bag and the rules from the above example:

    faded blue bags contain 0 other bags.
    dotted black bags contain 0 other bags.
    vibrant plum bags contain 11 other bags: 5 faded blue bags and 6 dotted black bags.
    dark olive bags contain 7 other bags: 3 faded blue bags and 4 dotted black bags.

So, a single shiny gold bag must contain 1 dark olive bag (and the 7 bags within it) plus 2 vibrant plum bags (and the 11 bags within each of those): 1 + 1*7 + 2 + 2*11 = 32 bags!

Of course, the actual rules have a small chance of going several levels deeper than this example; be sure to count all of the bags, even if the nesting becomes topologically impractical!

Here's another example:

shiny gold bags contain 2 dark red bags.
dark red bags contain 2 dark orange bags.
dark orange bags contain 2 dark yellow bags.
dark yellow bags contain 2 dark green bags.
dark green bags contain 2 dark blue bags.
dark blue bags contain 2 dark violet bags.
dark violet bags contain no other bags.

In this example, a single shiny gold bag must contain 126 other bags.

How many individual bags are required inside your single shiny gold bag?

Your puzzle answer was 9569.
*/
