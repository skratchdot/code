const { debug, run } = require('../lib');

const getRules = (ruleLine) => {
  return ruleLine.split('\n').map((line) => {
    const res = line.match(/([a-zA-Z ]+): (\d+)-(\d+) or (\d+)-(\d+)/);
    const name = res[1];
    const oneMin = parseFloat(res[2]);
    const oneMax = parseFloat(res[3]);
    const twoMin = parseFloat(res[4]);
    const twoMax = parseFloat(res[5]);
    return {
      name,
      checks: [
        [oneMin, oneMax],
        [twoMin, twoMax],
      ],
      counts: [],
      potentialIndexes: [],
    };
  });
};

const solve2 = (lines) => {
  const rules = getRules(lines[0]);
  const yourTicket = lines[1].split('\n')[1].split(',').map(parseFloat);
  const nearbyTickets = lines[2]
    .split('\n')
    .slice(1)
    .map((line) => line.split(',').map(parseFloat));

  // instead of each "ticket item" being a number, make it a set of rules that were passed
  nearbyTickets.forEach((ticket) => {
    ticket.forEach((num, i) => {
      ticket[i] = new Set();
      rules.forEach((rule) => {
        rule.checks.forEach(([min, max]) => {
          if (num >= min && num <= max) {
            ticket[i].add(rule.name);
          }
        });
      });
    });
  });

  // setup our invalid and valid ticket arrays.
  const validTickets = [];
  const invalidTickets = [];
  nearbyTickets.forEach((ticket) => {
    const isInvalid = ticket.filter((d) => d.size === 0).length;
    if (isInvalid) {
      invalidTickets.push(ticket);
    } else {
      validTickets.push(ticket);
    }
  });

  // populate the total number of times the rule "works" for a given index
  rules.forEach((rule) => {
    validTickets.forEach((ticket) => {
      ticket.forEach((set, i) => {
        if (!Number.isFinite(rule.counts[i])) {
          rule.counts[i] = 0;
        }
        if (set.has(rule.name)) {
          rule.counts[i]++;
        }
      });
    });
  });

  // find our potential indexes
  const potentialIndexes = [];
  rules.forEach((rule) => {
    rule.counts.forEach((count, i) => {
      if (count === validTickets.length) {
        rule.potentialIndexes.push(i);
        if (!potentialIndexes[i]) {
          potentialIndexes[i] = new Set();
        }
        potentialIndexes[i].add(rule.name);
      }
    });
  });

  // calculate our "final" rule placements
  const final = [];
  let found = 0;
  do {
    potentialIndexes.forEach((set, i) => {
      if (set.size === 1) {
        found++;
        const ruleName = [...set.keys()][0];
        final[i] = ruleName;
        potentialIndexes.forEach((set) => set.delete(ruleName));
      }
    });
  } while (found < potentialIndexes.length);

  // now that "final" contains the rules in the correct order, we need to
  // multiple all the values from "yourTicket" for the rules that start with "departure"
  const answer = final.reduce((answer, ruleName, index) => {
    if (ruleName.indexOf('departure') === 0) {
      return yourTicket[index] * answer;
    } else {
      return answer;
    }
  }, 1);

  debug({ final, answer });
  return answer;
};

run(__dirname, 'input', solve2, 2766491048287, { split: '\n\n' });

/*
--- Part Two ---

Now that you've identified which tickets contain invalid values, discard those tickets entirely. Use the remaining valid tickets to determine which field is which.

Using the valid ranges for each field, determine what order the fields appear on the tickets. The order is consistent between all tickets: if seat is the third field, it is the third field on every ticket, including your ticket.

For example, suppose you have the following notes:

class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9

Based on the nearby tickets in the above example, the first position must be row, the second position must be class, and the third position must be seat; you can conclude that in your ticket, class is 12, row is 11, and seat is 13.

Once you work out which field is which, look for the six fields on your ticket that start with the word departure. What do you get if you multiply those six values together?

Your puzzle answer was 2766491048287.
 */
