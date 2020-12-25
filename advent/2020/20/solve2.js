const { debug, run } = require('../../lib');

const SIDE_TOP = 0;
const SIDE_RIGHT = 1;
const SIDE_BOTTOM = 2;
const SIDE_LEFT = 3;
const SEAMONSTER = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `;

const seamonsterChecks = [];
SEAMONSTER.split('\n').forEach((row, rowNum) => {
  row.split('').forEach((val, colNum) => {
    if (val === '#') {
      seamonsterChecks.push({
        row: rowNum,
        col: colNum,
      });
    }
  });
});

const isSeamonster = (matrix, row, col) => {
  let result = true;
  try {
    for (let i = 0; i < seamonsterChecks.length; i++) {
      const check = seamonsterChecks[i];
      if (matrix[row + check.row][col + check.col] !== '#') {
        return false;
      }
    }
  } catch (err) {
    result = false;
  }
  return result;
};

const getSeamonsterPoints = (row, col) => {
  return seamonsterChecks.map((check) => ({
    row: row + check.row,
    col: col + check.col,
  }));
};

const rotate = (matrix) => {
  const size = matrix.length;
  const result = [];
  for (let i = 0; i < size; i++) {
    result[i] = [];
    for (let j = 0; j < size; j++) {
      result[i][j] = matrix[size - j - 1][i];
    }
  }
  return result;
};
const flip = (matrix) => {
  const size = matrix.length;
  const result = [];
  for (let i = 0; i < size; i++) {
    result[i] = [];
    for (let j = 0; j < size; j++) {
      result[i][j] = matrix[i][size - j - 1];
    }
  }
  return result;
};
const stripEdges = (matrix) => {
  const size = matrix.length;
  const result = [];
  for (let i = 1; i < size - 1; i++) {
    result[i - 1] = [];
    for (let j = 1; j < size - 1; j++) {
      result[i - 1][j - 1] = matrix[i][j];
    }
  }
  return result;
};
const getOrientation = (matrix, num) => {
  return [
    (m) => m,
    (m) => rotate(m),
    (m) => rotate(rotate(m)),
    (m) => rotate(rotate(rotate(m))),
    (m) => flip(m),
    (m) => rotate(flip(m)),
    (m) => rotate(rotate(flip(m))),
    (m) => rotate(rotate(rotate(flip(m)))),
  ][num](matrix);
};

const testMatrix = [
  [1, 2, 3],
  [8, 9, 4],
  [7, 6, 5],
];
require('assert').deepStrictEqual(rotate(testMatrix), [
  [7, 8, 1],
  [6, 9, 2],
  [5, 4, 3],
]);
require('assert').deepStrictEqual(flip(testMatrix), [
  [3, 2, 1],
  [4, 9, 8],
  [5, 6, 7],
]);
require('assert').deepStrictEqual(getOrientation(testMatrix, 0), testMatrix);
require('assert').deepStrictEqual(getOrientation(testMatrix, 1), [
  [7, 8, 1],
  [6, 9, 2],
  [5, 4, 3],
]);
require('assert').deepStrictEqual(getOrientation(testMatrix, 2), [
  [5, 6, 7],
  [4, 9, 8],
  [3, 2, 1],
]);
require('assert').deepStrictEqual(getOrientation(testMatrix, 3), [
  [3, 4, 5],
  [2, 9, 6],
  [1, 8, 7],
]);
require('assert').deepStrictEqual(getOrientation(testMatrix, 4), [
  [3, 2, 1],
  [4, 9, 8],
  [5, 6, 7],
]);
require('assert').deepStrictEqual(getOrientation(testMatrix, 5), [
  [5, 4, 3],
  [6, 9, 2],
  [7, 8, 1],
]);
require('assert').deepStrictEqual(getOrientation(testMatrix, 6), [
  [7, 6, 5],
  [8, 9, 4],
  [1, 2, 3],
]);
require('assert').deepStrictEqual(getOrientation(testMatrix, 7), [
  [1, 8, 7],
  [2, 9, 6],
  [3, 4, 5],
]);
require('assert').deepStrictEqual(stripEdges(testMatrix), [[9]]);
require('assert').deepStrictEqual(
  stripEdges([
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
  ]),
  [
    [6, 7],
    [10, 11],
  ]
);

// there are 8 possible orientations (i broke out pen/paper to draw lol)
const mapTiles = (line) => {
  const [name, ...rows] = line.split('\n');

  const matrix = rows.map((row) => row.split(''));

  // top, right, bottom, left
  const sides1 = [
    rows[0],
    rows.map((row) => row[row.length - 1]).join(''),
    rows[rows.length - 1],
    rows.map((row) => row[0]).join(''),
  ];
  // reversed
  const sides2 = sides1.map((d) => d.split('').reverse().join(''));

  // there are 8 possible orientations (i broke out pen/paper to draw lol)
  const orientations = [
    [sides1[0], sides1[1], sides1[2], sides1[3]],
    [sides2[3], sides1[0], sides2[1], sides1[2]],
    [sides2[2], sides2[3], sides2[0], sides2[1]],
    [sides1[1], sides2[2], sides1[3], sides2[0]],

    [sides2[0], sides1[3], sides2[2], sides1[1]],
    [sides2[1], sides2[0], sides2[3], sides2[2]],
    [sides1[2], sides2[1], sides1[0], sides2[3]],
    [sides1[3], sides1[2], sides1[1], sides1[0]],
  ];

  return {
    name,
    tileNum: parseFloat(name.replace(/\D/g, '')),
    matrix,
    rows,
    sides1,
    sides2,
    orientations,
  };
};

require('assert').deepStrictEqual(
  mapTiles('tile 1:\n123\n8x4\n765').orientations[0],
  ['123', '345', '765', '187']
);

const solve2 = (lines) => {
  const numTiles = lines.length;
  const gridSize = Math.sqrt(numTiles);
  const tileMap = {};
  const sideMap = {};
  const tiles = lines.map(mapTiles);

  const addToSideMap = (sideMap, sides, tileNum) => {
    sides.forEach((side) => {
      if (!sideMap.hasOwnProperty(side)) {
        sideMap[side] = new Set();
      }
      sideMap[side].add(tileNum);
    });
  };

  const initGrid = () => {
    const grid = [];
    for (let i = 0; i < gridSize; i++) {
      grid[i] = [];
      for (let j = 0; j < gridSize; j++) {
        grid[i][j] = undefined;
      }
    }
    return grid;
  };

  const canAdd = (grid, row, col) =>
    row >= 0 &&
    row <= gridSize - 1 &&
    col >= 0 &&
    col <= gridSize - 1 &&
    grid[row][col] === undefined;

  const getTileWithOrientation = (tileNum, side, sideNum) => {
    const connectedTileNum = [...sideMap[side]].filter((v) => v !== tileNum)[0];
    const tile = tileMap[connectedTileNum];
    for (let i = 0; i < tile.orientations.length; i++) {
      if (tile.orientations[i][sideNum] === side) {
        return [tile, i];
      }
    }
  };

  const addTile = (grid, row, col, tile, orientation) => {
    if (grid[row][col]) {
      throw new Error('already occupied');
    }
    grid[row][col] = [tile.tileNum, orientation];

    // add top
    if (canAdd(grid, row - 1, col)) {
      const topSide = tile.orientations[orientation][SIDE_TOP];
      addTile(
        grid,
        row - 1,
        col,
        ...getTileWithOrientation(tile.tileNum, topSide, SIDE_BOTTOM)
      );
    }

    // add right
    if (canAdd(grid, row, col + 1)) {
      const topSide = tile.orientations[orientation][SIDE_RIGHT];
      addTile(
        grid,
        row,
        col + 1,
        ...getTileWithOrientation(tile.tileNum, topSide, SIDE_LEFT)
      );
    }

    // add bottom
    if (canAdd(grid, row + 1, col)) {
      const topSide = tile.orientations[orientation][SIDE_BOTTOM];
      addTile(
        grid,
        row + 1,
        col,
        ...getTileWithOrientation(tile.tileNum, topSide, SIDE_TOP)
      );
    }

    // add left
    if (canAdd(grid, row, col - 1)) {
      const topSide = tile.orientations[orientation][SIDE_LEFT];
      addTile(
        grid,
        row,
        col - 1,
        ...getTileWithOrientation(tile.tileNum, topSide, SIDE_RIGHT)
      );
    }
  };

  tiles.forEach((tile) => {
    tileMap[tile.tileNum] = tile;
    addToSideMap(sideMap, tile.sides1, tile.tileNum);
    addToSideMap(sideMap, tile.sides2, tile.tileNum);
  });

  debug({ tileMap, sideMap, numTiles, gridSize });

  let grid;
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      grid = initGrid(gridSize);
      try {
        addTile(grid, i, j, tiles[0], 0);
        debug(`yep: ${i} ${j}`);
        i = gridSize;
        j = gridSize;
      } catch (err) {
        debug(`nope: ${i} ${j}`);
      }
    }
  }

  debug({ grid });

  const buildMatrix = (grid, withEdges) => {
    const matrix = [];
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const [tileNum, orientation] = grid[i][j];
        let m = getOrientation(tileMap[tileNum].matrix, orientation);
        if (!withEdges) {
          m = stripEdges(m);
        }
        const rowNum = i * m.length;
        m.forEach((row, rowNumInc) => {
          const index = rowNum + rowNumInc;
          if (!matrix[index]) {
            matrix[index] = [];
          }
          matrix[index] = [...matrix[index], ...row];
        });
      }
    }
    return matrix;
  };

  const matrixWithEdges = buildMatrix(grid, true);
  const matrixWithoutEdges = buildMatrix(grid, false);
  debug({ matrixWithEdges, matrixWithoutEdges });

  let counts = [];
  for (let orientation = 0; orientation < 8; orientation++) {
    counts.push(orientation);
  }
  counts = counts.map((orientation) => {
    let count = 0;
    let seamonsterPoints = [];
    let points = [];
    const matrix = getOrientation(matrixWithoutEdges, orientation);
    for (let i = 0; i < matrix.length; i++) {
      const row = matrix[i];
      for (let j = 0; j < row.length; j++) {
        if (matrix[i][j] === '#') {
          points.push({ row: i, col: j });
        }
        if (isSeamonster(matrix, i, j)) {
          count++;
          seamonsterPoints = [
            ...seamonsterPoints,
            ...getSeamonsterPoints(i, j),
          ];
        }
      }
    }
    const roughness = points.filter(
      (point) =>
        !seamonsterPoints.some(
          (el) => el.row === point.row && el.col === point.col
        )
    );
    return {
      count,
      pointsLength: points.length,
      roughnessLength: roughness.length,
      seamonsterPointsLength: seamonsterPoints.length,
      points,
      roughness,
      seamonsterPoints,
    };
  });

  debug({ counts });

  const answer = counts.reduce((prev, curr) =>
    !Number.isFinite(prev) || curr.roughnessLength < prev
      ? curr.roughnessLength
      : prev
  );

  return answer;
};

run(__dirname, 'inputtest', solve2, 273, { split: '\n\n' });
run(__dirname, 'input', solve2, 2031, { split: '\n\n' });

/*
--- Part Two ---

Now, you're ready to check the image for sea monsters.

The borders of each tile are not part of the actual image; start by removing them.

In the example above, the tiles become:

.#.#..#. ##...#.# #..#####
###....# .#....#. .#......
##.##.## #.#.#..# #####...
###.#### #...#.## ###.#..#
##.#.... #.##.### #...#.##
...##### ###.#... .#####.#
....#..# ...##..# .#.###..
.####... #..#.... .#......

#..#.##. .#..###. #.##....
#.####.. #.####.# .#.###..
###.#.#. ..#.#### ##.#..##
#.####.. ..##..## ######.#
##..##.# ...#...# .#.#.#..
...#..#. .#.#.##. .###.###
.#.#.... #.##.#.. .###.##.
###.#... #..#.##. ######..

.#.#.### .##.##.# ..#.##..
.####.## #.#...## #.#..#.#
..#.#..# ..#.#.#. ####.###
#..####. ..#.#.#. ###.###.
#####..# ####...# ##....##
#.##..#. .#...#.. ####...#
.#.###.. ##..##.. ####.##.
...###.. .##...#. ..#..###

Remove the gaps to form the actual image:

.#.#..#.##...#.##..#####
###....#.#....#..#......
##.##.###.#.#..######...
###.#####...#.#####.#..#
##.#....#.##.####...#.##
...########.#....#####.#
....#..#...##..#.#.###..
.####...#..#.....#......
#..#.##..#..###.#.##....
#.####..#.####.#.#.###..
###.#.#...#.######.#..##
#.####....##..########.#
##..##.#...#...#.#.#.#..
...#..#..#.#.##..###.###
.#.#....#.##.#...###.##.
###.#...#..#.##.######..
.#.#.###.##.##.#..#.##..
.####.###.#...###.#..#.#
..#.#..#..#.#.#.####.###
#..####...#.#.#.###.###.
#####..#####...###....##
#.##..#..#...#..####...#
.#.###..##..##..####.##.
...###...##...#...#..###

Now, you're ready to search for sea monsters! Because your image is monochrome, a sea monster will look like this:

                  # 
#    ##    ##    ###
 #  #  #  #  #  #   

When looking for this pattern in the image, the spaces can be anything; only the # need to match. Also, you might need to rotate or flip your image before it's oriented correctly to find sea monsters. In the above image, after flipping and rotating it to the appropriate orientation, there are two sea monsters (marked with O):

.####...#####..#...###..
#####..#..#.#.####..#.#.
.#.#...#.###...#.##.O#..
#.O.##.OO#.#.OO.##.OOO##
..#O.#O#.O##O..O.#O##.##
...#.#..##.##...#..#..##
#.##.#..#.#..#..##.#.#..
.###.##.....#...###.#...
#.####.#.#....##.#..#.#.
##...#..#....#..#...####
..#.##...###..#.#####..#
....#.##.#.#####....#...
..##.##.###.....#.##..#.
#...#...###..####....##.
.#.##...#.##.#.#.###...#
#.###.#..####...##..#...
#.###...#.##...#.##O###.
.O##.#OO.###OO##..OOO##.
..O#.O..O..O.#O##O##.###
#.#..##.########..#..##.
#.#####..#.#...##..#....
#....##..#.#########..##
#...#.....#..##...###.##
#..###....##.#...##.##.#

Determine how rough the waters are in the sea monsters' habitat by counting the number of # that are not part of a sea monster. In the above example, the habitat's water roughness is 273.

How many # are not part of a sea monster?


 */
