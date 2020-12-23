const { debug, run } = require('../lib');

const solve1 = (lines, moves) => {
  let cups = lines[0].split('').map(parseFloat);

  let moveNumber = 1;
  let currentCupIndex = 0;

  while (moveNumber <= moves) {
    let currentCupValue = cups[currentCupIndex];
    // The crab picks up the three cups that are immediately clockwise of the current cup.
    // They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
    const pickedUpIndexes = [];
    for (let i = 1; i <= 3; i++) {
      pickedUpIndexes.push((currentCupIndex + i) % cups.length);
    }
    const pickedUpValues = pickedUpIndexes.map((i) => cups[i]);

    // The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
    // If this would select one of the cups that was just picked up, the crab will keep subtracting one until
    // it finds a cup that wasn't just picked up. If at any point in this process the value goes below the
    // lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
    let destinationValue = cups[currentCupIndex] - 1;
    let destinationIndex = null;
    while (!Number.isFinite(destinationIndex)) {
      let tryToPickup = cups.indexOf(destinationValue);
      if (tryToPickup === -1) {
        destinationValue = Math.max(...cups);
      } else if (!pickedUpIndexes.includes(tryToPickup)) {
        destinationIndex = tryToPickup;
      } else {
        destinationValue--;
      }
    }

    debug(`\n-- move ${moveNumber} --`);
    debug(`cups: ${cups}`);
    debug(`current: ${currentCupValue}`);
    debug(`pick up: ${pickedUpValues}`);
    debug(`destination: ${destinationValue}`);

    // The crab places the cups it just picked up so that they are immediately clockwise of the destination cup.
    // They keep the same order as when they were picked up.
    const newCups = [];
    const cupsOnTable = cups.filter((c, i) => !pickedUpIndexes.includes(i));
    const cupsPickedUp = pickedUpIndexes.map((i) => cups[i]);
    while (cupsOnTable.length && cupsPickedUp.length) {
      const cup = cupsOnTable.shift();
      newCups.push(cup);
      if (cup === destinationValue) {
        while (cupsPickedUp.length) {
          newCups.push(cupsPickedUp.shift());
        }
        while (cupsOnTable.length) {
          newCups.push(cupsOnTable.shift());
        }
      }
    }
    cups = [...newCups];

    // shift until cups[currentCupIndex] === currentCupValue
    while (cups[currentCupIndex] !== currentCupValue) {
      cups.push(cups.shift());
    }

    // The crab selects a new current cup: the cup which is immediately clockwise of the current cup.
    currentCupIndex = (currentCupIndex + 1) % cups.length;

    moveNumber++;
  }

  debug(`\n-- final --`);
  debug(`cups: ${cups}`);

  // shift until 1 is the first index
  while (cups[0] !== 1) {
    cups.push(cups.shift());
  }

  return cups.slice(1).join('');
};

run(__dirname, 'inputtest', solve1, '92658374', { args: [10] });
run(__dirname, 'inputtest', solve1, '67384529', { args: [100] });
run(__dirname, 'input', solve1, '28946753', { args: [100] });

/*
--- Day 23: Crab Cups ---

The small crab challenges you to a game! The crab is going to mix up some cups, and you have to predict where they'll end up.

The cups will be arranged in a circle and labeled clockwise (your puzzle input). For example, if your labeling were 32415, there would be five cups in the circle; going clockwise around the circle from the first cup, the cups would be labeled 3, 2, 4, 1, 5, and then back to 3 again.

Before the crab starts, it will designate the first cup in your list as the current cup. The crab is then going to do 100 moves.

Each move, the crab does the following actions:

    The crab picks up the three cups that are immediately clockwise of the current cup. They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
    The crab selects a destination cup: the cup with a label equal to the current cup's label minus one. If this would select one of the cups that was just picked up, the crab will keep subtracting one until it finds a cup that wasn't just picked up. If at any point in this process the value goes below the lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
    The crab places the cups it just picked up so that they are immediately clockwise of the destination cup. They keep the same order as when they were picked up.
    The crab selects a new current cup: the cup which is immediately clockwise of the current cup.

For example, suppose your cup labeling were 389125467. If the crab were to do merely 10 moves, the following changes would occur:

-- move 1 --
cups: (3) 8  9  1  2  5  4  6  7 
pick up: 8, 9, 1
destination: 2

-- move 2 --
cups:  3 (2) 8  9  1  5  4  6  7 
pick up: 8, 9, 1
destination: 7

-- move 3 --
cups:  3  2 (5) 4  6  7  8  9  1 
pick up: 4, 6, 7
destination: 3

-- move 4 --
cups:  7  2  5 (8) 9  1  3  4  6 
pick up: 9, 1, 3
destination: 7

-- move 5 --
cups:  3  2  5  8 (4) 6  7  9  1 
pick up: 6, 7, 9
destination: 3

-- move 6 --
cups:  9  2  5  8  4 (1) 3  6  7 
pick up: 3, 6, 7
destination: 9

-- move 7 --
cups:  7  2  5  8  4  1 (9) 3  6 
pick up: 3, 6, 7
destination: 8

-- move 8 --
cups:  8  3  6  7  4  1  9 (2) 5 
pick up: 5, 8, 3
destination: 1

-- move 9 --
cups:  7  4  1  5  8  3  9  2 (6)
pick up: 7, 4, 1
destination: 5

-- move 10 --
cups: (5) 7  4  1  8  3  9  2  6 
pick up: 7, 4, 1
destination: 3

-- final --
cups:  5 (8) 3  7  4  1  9  2  6 

In the above example, the cups' values are the labels as they appear moving clockwise around the circle; the current cup is marked with ( ).

After the crab is done, what order will the cups be in? Starting after the cup labeled 1, collect the other cups' labels clockwise into a single string with no extra characters; each number except 1 should appear exactly once. In the above example, after 10 moves, the cups clockwise from 1 are labeled 9, 2, 6, 5, and so on, producing 92658374. If the crab were to complete all 100 moves, the order after cup 1 would be 67384529.

Using your labeling, simulate 100 moves. What are the labels on the cups after cup 1?

Your puzzle answer was 28946753.
 */
