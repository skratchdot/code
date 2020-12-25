#!/usr/bin/env bash

YEAR="2020"

for i in {1..25}
do
  DAY=`printf %02d $i`
  echo "Day: $DAY"
  node "$YEAR/$DAY/solve1.js";
  node "$YEAR/$DAY/solve2.js";
done
