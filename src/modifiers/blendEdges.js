const { generateArrayOfColor, sortRectanglesByArea, averageOf, averageFactored } = require('./arrayHelpers');
const { control } = require('../utils');

const METHOD_NAME = 'blendEdges';
const _log = msg => control(msg, METHOD_NAME);

// How far away from the edge will blending occur.
const BLEND_SIZE = 100;

const blendColor = (edgeColor, originalColor, distance) =>
  averageOf(
    [
      // ...generateArrayOfColor(Math.floor(), edgeColor),
      edgeColor,
      originalColor
    ]
  );

// Rect { height: 54, width: 54, y: 174, x: 331 },
// Rect { height: 68, width: 68, y: 215, x: 488 }

const _top = r => r.y;
const _bottom = r => r.y + r.height;
const _left = r => r.x;
const _right = r => r.x + r.width;

// const rowIsWithin = distance => (row, edge) => ({
//   top: row < edge && Math.abs(row - edge) <= distance,
//   bottom: row > edge && Math.abs(edge - row) >= distance
// })

const rowIsWithinAbove = (distance) => (row, edge) =>
  row < edge && Math.abs(row - edge) <= distance;

const rowIsWithinBelow = (distance) => (row, edge) =>
  row > edge && Math.abs(row - edge) <= distance;

const theseAreTheSame = (a, b) =>
  a[0] === b[0] && a[1] === b[1] && a[2] === b[2];

const blendEdges = (rectangles, target) => {
  const numRows = target.length;
  const numColumns = target[0].length;

  const topEdges = rectangles.map(_top);
  const bottomEdges = rectangles.map(_bottom);

  const edgeBlender = (distanceFunc, rowIsWithinFunc) => edge => {
    for (row = 0; row < numRows; row++) {
      if (rowIsWithinFunc(row, edge)) {
        for (column = 0; column < numColumns; column++) {
          const newColor =
            averageFactored(
              target[edge][column],
              target[row][column],
              (1 / BLEND_SIZE) * distanceFunc(edge, row)
            );
          // _log(`Changing ${target[row][column]} to ${newColor}`);
          target[row][column] = newColor;
        }
      }
    }
  }

  topEdges.forEach(
    edgeBlender(
      (edge, row) => edge - row,
      rowIsWithinAbove(BLEND_SIZE)
    )
  );

  bottomEdges.forEach(
    edgeBlender(
      (edge, row) => row - edge,
      rowIsWithinBelow(BLEND_SIZE)
    )
  );
  return target;
};

module.exports = blendEdges;