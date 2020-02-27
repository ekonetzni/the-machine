const { generateFilledRow } = require('./arrayHelpers');

const midlineHorizontalInterleaved = sizeFactor => target => {
  const targetLength = target[0].length;
  const samplePixelIndex = targetLength / 2; // midline

  // Allocate a big ass array.
  let outputRows = new Array(target.length * sizeFactor);
  const outputColumns = targetLength * sizeFactor;
  const baseRows = outputRows.length;
  let row = 0;
  let forwardColor;
  let gradientFactor = 0;
  for (row = 0; row < baseRows; row++) {
    const targetRow = Math.floor(row / sizeFactor);

    if (row % sizeFactor === 0) {
      // Every nth row look forward n rows and
      // snag a sample color
      // set gradient factor to n and decrement by 1 each
      // subsequent loop
      forwardColor =
        targetRow + sizeFactor < target.length - 1
          ? target[targetRow + sizeFactor][samplePixelIndex]
          : target[target.length - 1][samplePixelIndex];
      gradientFactor = sizeFactor + 2;
    } else {
      gradientFactor = gradientFactor - 1;
    }

    if (gradientFactor < 2) {
      _log(
        `gradientFactor is ${gradientFactor} (<2) at r ${row} and sf ${sizeFactor}`
      );
    }
    const color = target[targetRow][samplePixelIndex];
    outputRows[row] = _generateInterleavedGradient(
      outputColumns,
      color,
      forwardColor,
      gradientFactor
    );
  }

  return outputRows;
};

module.exports = midlineHorizontalInterleaved;
