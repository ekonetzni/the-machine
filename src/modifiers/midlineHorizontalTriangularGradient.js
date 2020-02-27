const _generateTriangularGradient = (
  length,
  colorA,
  colorB,
  gradient,
  sizeFactor
) => {
  return Array.from({ length }, (_, i) => {
    // Out of every sizeFactor pixels, gradient should be colorA
    // the remainder should be colorB
    return i % sizeFactor > gradient ? colorB : colorA;
  });
};

const _midlineHorizontalTriangular = sizeFactor => target => {
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
      gradientFactor = sizeFactor;
    } else {
      gradientFactor = gradientFactor - 1;
    }

    const color = target[targetRow][samplePixelIndex];
    outputRows[row] = _generateTriangularGradient(
      outputColumns,
      color,
      forwardColor,
      gradientFactor,
      sizeFactor
    );
  }

  return outputRows;
};

module.exports = _midlineHorizontalTriangular;
