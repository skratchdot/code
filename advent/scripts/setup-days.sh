#!/usr/bin/env bash

YEAR="2020"

SOLVE1="const { debug, run } = require('../../lib');

const solve1 = (lines) => {};

run(__dirname, 'inputtest', solve1, 0);
run(__dirname, 'input', solve1, 0);

/*
*/
"

SOLVE2="const { debug, run } = require('../../lib');

const solve2 = (lines) => {};

run(__dirname, 'inputtest', solve2, 0);
run(__dirname, 'input', solve2, 0);

/*
*/
"

for i in {1..25}
do
  DAY=`printf %02d $i`
  echo "Day: $DAY"
  mkdir -p "$YEAR/$DAY/";
  touch "$YEAR/$DAY/inputtest";
  echo "$SOLVE1" > "$YEAR/$DAY/solve1.js";
  echo "$SOLVE2" > "$YEAR/$DAY/solve2.js";
done
