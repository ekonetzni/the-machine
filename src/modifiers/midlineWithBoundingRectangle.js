const { generateFilledRow } = require('./arrayHelpers');
const RECT_PADDING = 100;

// Rect { height: 251, width: 251, y: 154, x: 437 }
const rowIsInside = (rect, r) =>
  r >= rect.y &&
  r <= rect.y + rect.height;

// const rowIsInside = (rect, r) =>
//   r >= Math.max(0, rect.y - RECT_PADDING) &&
//   r <= Math.min(rect.length, rect.y + rect.height + RECT_PADDING);

const middleOfRectangle = (rect) =>
  Math.floor(rect.x + (rect.width / 2));

const midlineHorizontal = (rectangle, target) => {
  const numRows = target.length;
  const numColumns = target[0].length;

  let row = 0;
  for (row = 0; row < numRows; row++) {
    if (rowIsInside(rectangle, row)) {
      target[row] =
        generateFilledRow(
          numColumns,
          target[row][middleOfRectangle(rectangle)]
        );
    }
  }

  return target;
};

const _center = rectangle => ({
  x: Math.floor(rect.x + (rect.width / 2)),
  y: Math.floor(rect.y + (rect.height / 2))
});

const midlineVertical = (rectangle, target) => {
  const numRows = target.length;
  const numColumns = target[0].length;

  let row = 0;
  for (row = 0; row < numRows; row++) {
    if (rowIsInside(rectangle, row)) {
      target[row] =
        generateFilledRow(
          numColumns,
          target[row][middleOfRectangle(rectangle)]
        );
    }
  }

  return target;
};

module.exports = midlineHorizontal;
