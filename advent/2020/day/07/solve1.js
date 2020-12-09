const { debug, run } = require('../lib');

const solve1 = (lines) => {
  const bingo = 'shiny gold';
  const map = {};

  const clean = () => {
    let keepGoing = false;
    Object.keys(map).forEach((key) => {
      let items = map[key];
      if (Array.isArray(items)) {
        // remove nos
        items = items.filter((v) => map[v] !== false);
        if (items.length === 0) {
          items = false;
        } else if (items.some((v) => map[v] === true)) {
          items = true;
        } else {
          keepGoing = true;
        }
        map[key] = items;
      }
    });
    return keepGoing;
  };

  lines.forEach((line) => {
    let [bag, rules] = line.replace(/\./gi, '').split(' contain ');
    let bags = rules
      .split(', ')
      .filter((rule) => rule !== 'no other bags')
      .map((rule) => {
        const match = rule.match(/(\d+) (.*)$/);
        const num = parseFloat(match[1]);
        const bag = match[2].replace(/bags?/, '').trim();
        debug({ num, bag });
        return bag;
      });
    bag = bag.replace(/bags?/, '').trim();

    if (bags.length === 0) {
      map[bag] = false;
    } else if (bags.includes(bingo)) {
      map[bag] = true;
    } else {
      map[bag] = bags;
    }
  });

  while (clean()) {}

  let num = Object.keys(map)
    .map((key) => map[key])
    .filter((v) => v).length;

  debug(num);
  return num;
};

run(__dirname, 'inputtest', solve1, 4);
run(__dirname, 'input', solve1, 226);
