const { generateFilledRow } = require('./arrayHelpers');

const _averaged = sample =>
  sample
    .reduce(
      (acc, color) => {
        return [
          acc[0] + Math.pow(color[0], 2),
          acc[1] + Math.pow(color[1], 2),
          acc[2] + Math.pow(color[2], 2)
        ];
      },
      [0, 0, 0]
    )
    .map(rgbVal => Math.sqrt(rgbVal));

const _gatherSamples = (target, index, rowsToSample, sampleColumnIndex) =>
  target.slice(index, index + rowsToSample).map(row => row[sampleColumnIndex]);

const mhAverage = sizeFactor => original => {
  const originalColumns = original[0].length;
  const originalRows = original.length;
  const samplePixelIndex = originalColumns / 2; // midline

  // Allocate a big ass array.
  let modified = new Array(originalRows * sizeFactor);
  const modifiedColumns = original * sizeFactor;
  const modifiedRows = modified.length;

  let row = 0;
  for (row = 0; row < modifiedRows; row++) {
    const originalRow = Math.floor(row / sizeFactor);

    // Every nth row is an original row, just use the color from originalRow.
    // Every other row is a synthetic row, slice x rows forward and generate an
    // average.
    const color =
      row % sizeFactor === 0
        ? original[originalRow][samplePixelIndex]
        : _averaged(
            _gatherSamples(original, row, sizeFactor, samplePixelIndex)
          );
    modified[row] = generateFilledRow(modifiedColumns, color);
  }

  return modified;
};

module.exports = mhAverage;
