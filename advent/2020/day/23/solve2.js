const { debug, run } = require('../lib');

const ONE_MILLION = 1000000;
const TEN_MILLION = 10000000;
const PICK_UP_LENGTH = 3;

class Cup {
  constructor(value) {
    this.value = value;
    this.next = undefined;
  }
}

class CupList {
  constructor(originalCups, cupListSize) {
    // circular linked list stuff
    this.head = undefined;
    this.tail = undefined;

    // we need to be able to look up nodes by value
    this.map = new Map();

    // AoC requirements
    this.current = undefined;
    this.destination = undefined;
    this.pickedUp = [];
    this.moveNumber = 0;

    // in case we need this
    this.originalCups = originalCups;
    this.originalMax = Math.max(...originalCups);
    this.originalCupSize = originalCups.length;

    // add all our cups
    this.maxCupValue = this.originalMax;
    for (let i = 0; i < cupListSize; i++) {
      this.push(
        i < this.originalCupSize ? this.originalCups[i] : ++this.maxCupValue
      );
    }

    // current starts off as head
    this.current = this.head;
  }
  move() {
    this.moveNumber++;

    // The crab picks up the three cups that are immediately clockwise of the current cup.
    // They are removed from the circle; cup spacing is adjusted as necessary to maintain the circle.
    this.pickedUp = [];
    let pickingUp = this.current.next;
    for (let i = 1; i <= PICK_UP_LENGTH; i++) {
      this.pickedUp.push(pickingUp);
      pickingUp = pickingUp.next;
    }

    // The crab selects a destination cup: the cup with a label equal to the current cup's label minus one.
    // If this would select one of the cups that was just picked up, the crab will keep subtracting one until
    // it finds a cup that wasn't just picked up. If at any point in this process the value goes below the
    // lowest value on any cup's label, it wraps around to the highest value on any cup's label instead.
    let targetValue = this.current.value - 1;
    let targetFound = false;
    while (!targetFound) {
      const node = this.map.get(targetValue);
      if (node && !this.pickedUp.includes(node)) {
        this.destination = node;
        targetFound = true;
      }
      targetValue--;
      if (targetValue < 0) {
        targetValue = this.maxCupValue;
      }
    }

    debug(`\n-- move ${this.moveNumber} --`);
    debug(
      `cups: ${this.getHeadValues(this.originalCupSize)
        .map((v) => (this.current.value === v ? `(${v})` : v))
        .join(' ')}`
    );
    debug(`pick up: ${this.pickedUp.map((v) => v.value).join(', ')}`);
    debug(`destination: ${this.destination.value}`);

    // The crab places the cups it just picked up so that they are immediately clockwise of the destination cup.
    // They keep the same order as when they were picked up.
    const destinationNext = this.destination.next;
    const currentNext = this.current.next;
    const firstPickedUp = this.pickedUp[0];
    const lastPickedUp = this.pickedUp[this.pickedUp.length - 1];

    // actually remove nodes
    this.current.next = lastPickedUp.next;

    // now insert them
    this.destination.next = firstPickedUp;
    lastPickedUp.next = destinationNext;

    // now increment current node
    this.current = this.current.next;
  }
  getHeadValues(count) {
    let cup = this.head;
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push(cup.value);
      cup = cup.next;
    }
    return arr;
  }
  push(value) {
    const cup = new Cup(value);
    this.map.set(cup.value, cup);
    // head should only be null when our list is empty
    if (this.head === undefined) {
      this.head = cup;
      this.tail = cup;
      cup.next = cup;
    } else {
      this.tail.next = cup;
      this.tail = cup;
      cup.next = this.head;
    }
  }
}

const solve2 = (lines, moves, cupListSize) => {
  const originalCups = lines[0].split('').map(parseFloat);
  const cupList = new CupList(originalCups, cupListSize);
  for (let i = 0; i < moves; i++) {
    cupList.move();
  }
  const clockwiseOfOne = cupList.map.get(1).next;
  const afterClockwiseOfOne = clockwiseOfOne.next;
  return clockwiseOfOne.value * afterClockwiseOfOne.value;
};

run(__dirname, 'inputtest', solve2, 18, { args: [10, 9] });
run(__dirname, 'inputtest', solve2, 149245887792, {
  args: [TEN_MILLION, ONE_MILLION],
});
run(__dirname, 'input', solve2, 519044017360, {
  args: [TEN_MILLION, ONE_MILLION],
});

/*
--- Part Two ---

Due to what you can only assume is a mistranslation (you're not exactly fluent in Crab), you are quite surprised when the crab starts arranging many cups in a circle on your raft - one million (1000000) in total.

Your labeling is still correct for the first few cups; after that, the remaining cups are just numbered in an increasing fashion starting from the number after the highest number in your list and proceeding one by one until one million is reached. (For example, if your labeling were 54321, the cups would be numbered 5, 4, 3, 2, 1, and then start counting up from 6 until one million is reached.) In this way, every number from one through one million is used exactly once.

After discovering where you made the mistake in translating Crab Numbers, you realize the small crab isn't going to do merely 100 moves; the crab is going to do ten million (10000000) moves!

The crab is going to hide your stars - one each - under the two cups that will end up immediately clockwise of cup 1. You can have them if you predict what the labels on those cups will be when the crab is finished.

In the above example (389125467), this would be 934001 and then 159792; multiplying these together produces 149245887792.

Determine which two cups will end up immediately clockwise of cup 1. What do you get if you multiply their labels together?

Your puzzle answer was 519044017360.

Both parts of this puzzle are complete! They provide two gold stars: **

At this point, you should return to your Advent calendar and try another puzzle.

Your puzzle input was 586439172.
 */
