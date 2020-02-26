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

const _midlineHorizontal = sizeFactor => target => {
  const targetLength = target[0].length;
  const samplePixelIndex = targetLength / 2; // midline

  // Allocate a big ass array.
  let outputRows = new Array(target.length * sizeFactor);
  const outputColumns = targetLength * sizeFactor;
  const baseRows = outputRows.length;
  let row = 0;
  for (row = 0; row < baseRows; row++) {
    const color = target[Math.floor(row / sizeFactor)][samplePixelIndex];
    outputRows[row] = _generateFilledRow(outputColumns, color);
  }

  return outputRows;
};

const samplePixelIndex = (i, amountToShift, arrayLength) => {
  let sampleIndex = i - amountToShift;
  if (sampleIndex < 0) {
    sampleIndex = arrayLength - 1 + sampleIndex;
  } else if (sampleIndex >= arrayLength) {
    sampleIndex = sampleIndex - arrayLength;
  }
  return sampleIndex;
};

const __shiftArray = (arr, amountToShift) =>
  Array.from(
    arr,
    (_value, index) => arr[samplePixelIndex(index, amountToShift, arr.length)]
  );

const _shift = target => {
  const numRows = target.length;

  let row;
  for (row = 0; row < numRows; row++) {
    target[row] = __shiftArray(target[row], getRandomInt(-340, 340));
  }
  return target;
};

const _shimmy = target => {
  const numRows = target.length;
  const shimmyRange = 300;
  const shimmyFactor = 50;

  let row;
  let amountToShimmy = getRandomInt(shimmyRange * -1, shimmyRange);
  for (row = 0; row < numRows; row++) {
    target[row] = __shiftArray(target[row], amountToShimmy);
    amountToShimmy = !!getRandomInt(0, 1)
      ? amountToShimmy + shimmyFactor
      : amountToShimmy - shimmyFactor;
  }
  return target;
};

// We need to scale up 5x.

const makePainting = async (currentTarget, args) => {
  const { sizeFactor } = args.context.settings;
  // This kind of needs to done in place, unless we pipe it to fs
  // while we work, which just seems like a nightmare.
  try {
    _log(
      `Received target of dimensions ${currentTarget.length}, ${currentTarget[0].length}`
    );
    currentTarget = _midlineHorizontal(sizeFactor)(currentTarget);
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
    selectedFileName: 'Thisisatest.mp4',
    settings: require('config').get('settings')
  };

  const writeImage = require('./writeImage');
  const painting = await makePainting(require('../mocks/arrayData.json'), { context });

  //writeBlob('./testData.json', painting.result);
  const written = await writeImage(painting.result, {
    context
  });
};

__fire();

module.exports = makePainting;
