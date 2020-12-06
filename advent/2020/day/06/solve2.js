const assert = require('assert');
const fs = require('fs');

const groups = fs
  .readFileSync(`${__dirname}/input`, 'utf8')
  .trim()
  .split('\n\n');

let sum = 0;
const groupInfo = groups.map((group) => {
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

console.log(groupInfo);
console.log(sum);
