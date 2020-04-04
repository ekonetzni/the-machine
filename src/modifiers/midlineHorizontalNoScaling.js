const { generateArrayOfColor } = require('./arrayHelpers');

const midlineHorizontal = target => {
  const numRows = target.length;
  const numColumns = target[0].length;
  const samplePixelIndex = numColumns / 2; // Midline

  let row = 0;
  let column = 0;
  for (row = 0; row < numRows; row++) {
    const color = target[row][samplePixelIndex];
    target[row] = generateArrayOfColor(numColumns, color);
  }
  return target;
};

module.exports = midlineHorizontal;
