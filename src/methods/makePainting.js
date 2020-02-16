/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');

const METHOD_NAME = 'makePainting';
const _log = msg => control(msg, METHOD_NAME);

const _generateRowArray = (columns, colorValue) =>
  Array.from({ length: columns }, () => colorValue);

const makePainting = async (currentTarget, args) => {
  // This kind of needs to done in place, unless we pipe it to fs
  // while we work, which just seems like a nightmare.
  try {
    _log(`Received target of dimensions ${currentTarget.length}, ${currentTarget[0].length}`);
    const numRows = currentTarget.length;
    const numColumns = currentTarget[0].length;
    const samplePixelIndex = numColumns / 2; // Midline

    let row = 0
    let column = 0;
    for (row = 0; row < numRows; row++) {
      const color = currentTarget[row][samplePixelIndex];
      currentTarget[row] = _generateRowArray(numColumns, color);
    }
    _log(`After processing, target has dimensions ${currentTarget.length}, ${currentTarget[0].length}`);
  } catch (err) {
    _log('Painting is dead.', err);
  }

  return {
    result: currentTarget,
    name: METHOD_NAME,
    args
  };
};

const _fire = async () => {
  const result = await makePainting(require('../mocks/arrayData.json'), {});
}

module.exports = makePainting;
