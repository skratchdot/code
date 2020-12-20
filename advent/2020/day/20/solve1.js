const { debug, run } = require('../lib');

const SIDE_TOP = 0;
const SIDE_RIGHT = 1;
const SIDE_BOTTOM = 2;
const SIDE_LEFT = 3;

// there are 8 possible orientations (i broke out pen/paper to draw lol)
const mapTiles = (line) => {
  const [name, ...rows] = line.split('\n');

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

const solve1 = (lines) => {
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

  return (
    grid[0][0][0] *
    grid[gridSize - 1][0][0] *
    grid[0][gridSize - 1][0] *
    grid[gridSize - 1][gridSize - 1][0]
  );
};

run(__dirname, 'inputtest', solve1, 20899048083289, { split: '\n\n' });
run(__dirname, 'input', solve1, 8581320593371, { split: '\n\n' });

/*
--- Day 20: Jurassic Jigsaw ---

The high-speed train leaves the forest and quickly carries you south. You can even see a desert in the distance! Since you have some spare time, you might as well see if there was anything interesting in the image the Mythical Information Bureau satellite captured.

After decoding the satellite messages, you discover that the data actually contains many small images created by the satellite's camera array. The camera array consists of many cameras; rather than produce a single square image, they produce many smaller square image tiles that need to be reassembled back into a single image.

Each camera in the camera array returns a single monochrome image tile with a random unique ID number. The tiles (your puzzle input) arrived in a random order.

Worse yet, the camera array appears to be malfunctioning: each image tile has been rotated and flipped to a random orientation. Your first task is to reassemble the original image by orienting the tiles so they fit together.

To show how the tiles should be reassembled, each tile's image data includes a border that should line up exactly with its adjacent tiles. All tiles have this border, and the border lines up exactly when the tiles are both oriented correctly. Tiles at the edge of the image also have this border, but the outermost edges won't line up with any other tiles.

For example, suppose you have the following nine tiles:

Tile 2311:
..##.#..#.
##..#.....
#...##..#.
####.#...#
##.##.###.
##...#.###
.#.#.#..##
..#....#..
###...#.#.
..###..###

Tile 1951:
#.##...##.
#.####...#
.....#..##
#...######
.##.#....#
.###.#####
###.##.##.
.###....#.
..#.#..#.#
#...##.#..

Tile 1171:
####...##.
#..##.#..#
##.#..#.#.
.###.####.
..###.####
.##....##.
.#...####.
#.##.####.
####..#...
.....##...

Tile 1427:
###.##.#..
.#..#.##..
.#.##.#..#
#.#.#.##.#
....#...##
...##..##.
...#.#####
.#.####.#.
..#..###.#
..##.#..#.

Tile 1489:
##.#.#....
..##...#..
.##..##...
..#...#...
#####...#.
#..#.#.#.#
...#.#.#..
##.#...##.
..##.##.##
###.##.#..

Tile 2473:
#....####.
#..#.##...
#.##..#...
######.#.#
.#...#.#.#
.#########
.###.#..#.
########.#
##...##.#.
..###.#.#.

Tile 2971:
..#.#....#
#...###...
#.#.###...
##.##..#..
.#####..##
.#..####.#
#..#.#..#.
..####.###
..#.#.###.
...#.#.#.#

Tile 2729:
...#.#.#.#
####.#....
..#.#.....
....#..#.#
.##..##.#.
.#.####...
####.#.#..
##.####...
##..#.##..
#.##...##.

Tile 3079:
#.#.#####.
.#..######
..#.......
######....
####.#..#.
.#...#.##.
#.#####.##
..#.###...
..#.......
..#.###...

By rotating, flipping, and rearranging them, you can find a square arrangement that causes all adjacent borders to line up:

#...##.#.. ..###..### #.#.#####.
..#.#..#.# ###...#.#. .#..######
.###....#. ..#....#.. ..#.......
###.##.##. .#.#.#..## ######....
.###.##### ##...#.### ####.#..#.
.##.#....# ##.##.###. .#...#.##.
#...###### ####.#...# #.#####.##
.....#..## #...##..#. ..#.###...
#.####...# ##..#..... ..#.......
#.##...##. ..##.#..#. ..#.###...

#.##...##. ..##.#..#. ..#.###...
##..#.##.. ..#..###.# ##.##....#
##.####... .#.####.#. ..#.###..#
####.#.#.. ...#.##### ###.#..###
.#.####... ...##..##. .######.##
.##..##.#. ....#...## #.#.#.#...
....#..#.# #.#.#.##.# #.###.###.
..#.#..... .#.##.#..# #.###.##..
####.#.... .#..#.##.. .######...
...#.#.#.# ###.##.#.. .##...####

...#.#.#.# ###.##.#.. .##...####
..#.#.###. ..##.##.## #..#.##..#
..####.### ##.#...##. .#.#..#.##
#..#.#..#. ...#.#.#.. .####.###.
.#..####.# #..#.#.#.# ####.###..
.#####..## #####...#. .##....##.
##.##..#.. ..#...#... .####...#.
#.#.###... .##..##... .####.##.#
#...###... ..##...#.. ...#..####
..#.#....# ##.#.#.... ...##.....

For reference, the IDs of the above tiles are:

1951    2311    3079
2729    1427    2473
2971    1489    1171

To check that you've assembled the image correctly, multiply the IDs of the four corner tiles together. If you do this with the assembled tiles from the example above, you get 1951 * 3079 * 2971 * 1171 = 20899048083289.

Assemble the tiles into an image. What do you get if you multiply together the IDs of the four corner tiles?

Your puzzle answer was 8581320593371.
 */
