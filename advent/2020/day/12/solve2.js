const { debug, run } = require('../lib');

/*
    Action N means to move the waypoint north by the given value.
    Action S means to move the waypoint south by the given value.
    Action E means to move the waypoint east by the given value.
    Action W means to move the waypoint west by the given value.
    Action L means to rotate the waypoint around the ship left (counter-clockwise) the given number of degrees.
    Action R means to rotate the waypoint around the ship right (clockwise) the given number of degrees.
    Action F means to move forward to the waypoint a number of times equal to the given value.
*/

const solve = (lines) => {
  let waypointEast = 10;
  let waypointNorth = 1;
  let shipEast = 0;
  let shipNorth = 0;

  lines.forEach((line) => {
    const [instruction, ...rest] = line.split('');
    let val = parseFloat(rest.join(''));
    debug({
      shipEast,
      shipNorth,
      waypointEast,
      waypointNorth,
      line,
      instruction,
      val,
    });
    switch (instruction) {
      case 'N':
        waypointNorth += val;
        break;
      case 'S':
        waypointNorth -= val;
        break;
      case 'E':
        waypointEast += val;
        break;
      case 'W':
        waypointEast -= val;
        break;
      case 'L':
        while (val > 0) {
          let oldEast = waypointEast;
          let oldNorth = waypointNorth;
          waypointNorth = oldEast;
          waypointEast = -oldNorth;
          val -= 90;
        }
        break;
      case 'R':
        while (val > 0) {
          let oldEast = waypointEast;
          let oldNorth = waypointNorth;
          waypointNorth = -oldEast;
          waypointEast = oldNorth;
          val -= 90;
        }
        break;
      case 'F':
        shipEast += val * waypointEast;
        shipNorth += val * waypointNorth;
        break;
    }
  });
  return Math.abs(shipEast) + Math.abs(shipNorth);
};

run(__dirname, 'inputtest', solve, 286);
run(__dirname, 'input', solve, 28591);
