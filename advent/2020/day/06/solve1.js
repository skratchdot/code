const assert = require('assert');
const fs = require('fs');

const groups = fs.readFileSync(`${__dirname}/input`, 'utf8').trim().split('\n\n');




let sum = 0;
const groupInfo = groups.map(group => {
    const people = group.split('\n');
    const guesses = new Set();
    people.forEach(person => {
        person.split('').forEach(guess => guesses.add(guess));
    });
    const guessSum = guesses.size;
    sum += guessSum;
    return {
        group,
        people,
        numPeople: people.length,
        guesses,
        guessSum: guesses.size,
        guessSum
    }
});


console.log(groupInfo);
console.log(sum);
