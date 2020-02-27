/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control, getRandomInt, writeBlob } = require('../utils');

const METHOD_NAME = 'makePainting';
const _log = msg => control(msg, METHOD_NAME);

const _generateFilledRow = (columns, colorValue) =>
  Array.from({ length: columns }, () => colorValue);

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

const _generateInterleavedGradient = (length, colorA, colorB, gradient) =>
  Array.from({ length }, (_, i) => (i % gradient === 0 ? colorB : colorA));

const _midlineHorizontalInterleaved = sizeFactor => target => {
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

const makePainting = async (currentTarget, args) => {
  const { sizeFactor } = args.context.settings;
  // This kind of needs to done in place, unless we pipe it to fs
  // while we work, which just seems like a nightmare.
  try {
    _log(
      `Received target of dimensions ${currentTarget.length}, ${currentTarget[0].length}`
    );
    currentTarget = _midlineHorizontalInterleaved(sizeFactor)(currentTarget);
    _log(
      `After processing, target has dimensions ${currentTarget.length}, ${currentTarget[0].length}`
    );
  } catch (err) {
    _log(`Painting is dead.${err}`);
  }

  return {
    result: currentTarget,
    name: METHOD_NAME,
    args
  };
};

const __fire = async () => {
  const context = {
    selectedFileName: 'Interleavedx15-Colorful.mp4',
    settings: require('config').get('settings')
  };

  const writeImage = require('./writeImage');
  const painting = await makePainting(require('../mocks/multiColor.json'), {
    context
  });

  //writeBlob('./testData.json', painting.result);
  const written = await writeImage(painting.result, {
    context
  });
};

__fire();

module.exports = makePainting;
