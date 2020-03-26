const { control } = require('../utils');
const { generateFilledRow } = require('./arrayHelpers');
const RECT_PADDING = 100;

const METHOD_NAME = 'midline';
const _log = msg => control(msg, METHOD_NAME);

// const rowIsInside = (rect, r) =>
//   r >= Math.max(0, rect.y - RECT_PADDING) &&
//   r <= Math.min(rect.length, rect.y + rect.height + RECT_PADDING);

const middleOfRectangle = (rect) =>
  Math.floor(rect.x + (rect.width / 2));

const midlineHorizontal = (rectangle, target) => {
  const numRows = target.length;
  const numColumns = target[0].length;

  let row = 0;
  let column;
  for (row = 0; row < numRows; row++) {
    const color =
      rowIsInside(rectangle, row)
        ? target[row][middleOfRectangle(rectangle)]
        : target[row][numColumns / 2];

    target[row] =
      generateFilledRow(
        numColumns,
        color
      )
  }

  return target;
};

const _center = rectangle => ({
  x: Math.floor(rect.x + (rect.width / 2)),
  y: Math.floor(rect.y + (rect.height / 2))
});

// Rect { height: 251, width: 251, y: 154, x: 437 }
const rowIsInside = (rect, r) =>
  r >= rect.y &&
  r <= rect.y + rect.height;

const columnIsInside = (rect, c) =>
  c >= rect.x &&
  c <= rect.x + rect.width;

const pixelIsInside = (rect, column, row) =>
  rowIsInside(rect, row) && columnIsInside(rect, column);

const _sortRectanglesByArea = (a, b) =>
  (a.width * a.height) - (b.width * b.height);

const midlineVertical = (rectangles, target) => {
  if (process.env.DEBUG) { _log(`Received ${rectangles.length} faces.`); }

  const numRows = target.length;
  const numColumns = target[0].length;
  const middleRow = [...target[numRows / 2]];

  let row;
  let column;
  let rowHasAFace;
  for (row = 0; row < numRows; row++) {
    rowHasAFace = false;
    rectangles
      .sort(_sortRectanglesByArea)
      .forEach(rectangle => {
        if (rowIsInside(rectangle, row)) {
          rowHasAFace = true;
          target[row] =
            generateFilledRow(
              numColumns,
              target[row][middleOfRectangle(rectangle)]
            )
        }
      });
    if (!rowHasAFace) {
      for (column = 0; column < numColumns; column++) {
        target[row][column] = middleRow[column];
      }
    }
  }

  return target;
};

module.exports = midlineVertical;
