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

const _midlineHorizontal = target => {
  const numRows = target.length;
  const numColumns = target[0].length;
  const samplePixelIndex = numColumns / 2; // Midline

  let row = 0;
  let column = 0;
  for (row = 0; row < numRows; row++) {
    const color = target[row][samplePixelIndex];
    target[row] = _generateFilledRow(numColumns, color);
  }
  return target;
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
  const numColumns = target[0].length;

  let row = 0;
  let column = 0;
  for (row = 0; row < numRows; row++) {
    target[row] = __shiftArray(target[row], getRandomInt(-340, 340));
  }
  return target;
};

const makePainting = async (currentTarget, args) => {
  // This kind of needs to done in place, unless we pipe it to fs
  // while we work, which just seems like a nightmare.
  try {
    _log(
      `Received target of dimensions ${currentTarget.length}, ${currentTarget[0].length}`
    );
    currentTarget = _shift(currentTarget);
    // writeBlob('./testArray.json', currentTarget);
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
  const writeImage = require('./writeImage');
  const painting = await makePainting(require('../mocks/arrayData.json'), {});
  const written = await writeImage(painting.result, {
    context: {
      selectedFileName: 'Thisisatest.mp4',
      settings: require('config').get('settings')
    }
  });
};

// __fire();

module.exports = makePainting;
