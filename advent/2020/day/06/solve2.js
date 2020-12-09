const { debug, run } = require('../lib');

const solve2 = (lines) => {
  let sum = 0;
  const groupInfo = lines.map((group) => {
    const people = group.split('\n');
    const guesses = new Map();
    people.forEach((person) => {
      person.split('').forEach((guess) => {
        if (!guesses.has(guess)) {
          guesses.set(guess, 0);
        }
        let g = guesses.get(guess);
        g++;
        guesses.set(guess, g);
      });
    });
    let guessSum = 0;
    for (let [guess, numPeople] of guesses.entries()) {
      if (numPeople === people.length) {
        guessSum++;
      }
    }
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

run(__dirname, 'inputtest', solve2, 6, { split: '\n\n' });
run(__dirname, 'input', solve2, 3402, { split: '\n\n' });
