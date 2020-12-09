#!/usr/bin/env bash
for i in {1..25}
do
  day=`printf %02d $i`
  echo "Day: $day"
  node "day/$day/solve1.js";
  node "day/$day/solve2.js";
done
