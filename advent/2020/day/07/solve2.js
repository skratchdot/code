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
