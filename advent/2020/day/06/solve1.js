const { debug, run } = require('../lib');

const solve1 = (lines) => {
  let sum = 0;
  const groupInfo = lines.map((group) => {
    const people = group.split('\n');
    const guesses = new Set();
    people.forEach((person) => {
      person.split('').forEach((guess) => guesses.add(guess));
    });
    const guessSum = guesses.size;
    sum += guessSum;
    return {
      group,
      people,
      numPeople: people.length,
      guesses,
      guessSum: guesses.size,
      guessSum,
    };
  });

  debug({ groupInfo, sum });
  return sum;
};

run(__dirname, 'inputtest', solve1, 11, { split: '\n\n' });
run(__dirname, 'input', solve1, 6534, { split: '\n\n' });
