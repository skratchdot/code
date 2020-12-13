#!/usr/bin/env bash

SOLVE1="const { debug, run } = require('../lib');

const solve1 = (lines) => {};

run(__dirname, 'inputtest', solve1, 0);
run(__dirname, 'input', solve1, 0);

/*
*/
"

SOLVE2="const { debug, run } = require('../lib');

const solve2 = (lines) => {};

run(__dirname, 'inputtest', solve2, 0);
run(__dirname, 'input', solve2, 0);

/*
*/
"

for i in {1..25}
do
  day=`printf %02d $i`
  echo "Day: $day"
  mkdir -p "day/$day/";
  touch "day/$day/inputtest";
  echo "$SOLVE1" > "day/$day/solve1.js";
  echo "$SOLVE2" > "day/$day/solve2.js";
done
