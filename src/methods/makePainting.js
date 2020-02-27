/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control, getRandomInt, writeBlob } = require('../utils');

const midlineHorizontal = require('../modifiers/midlineHorizontalNoScaling');
const midlineHorizontalAverage = require('../modifiers/midlineHorizontalAverage');

const METHOD_NAME = 'makePainting';
const _log = msg => control(msg, METHOD_NAME);

const makePainting = async (currentTarget, args) => {
  const { sizeFactor } = args.context.settings;
  let result;
  // This kind of needs to done in place, unless we pipe it to fs
  // while we work, which just seems like a nightmare.
  try {
    _log(
      `Received target of dimensions ${currentTarget.length}, ${currentTarget[0].length}`
    );
    result = midlineHorizontalAverage(sizeFactor)(currentTarget);
    // Hacking here to try to keep memory footprint a bit lower.
    currentTarget = [];
    _log(
      `After processing, target has dimensions ${result.length}, ${result[0].length}`
    );
  } catch (err) {
    _log(`Painting is dead.${err}`);
  }

  return {
    result,
    name: METHOD_NAME,
    args
  };
};

const __fire = async () => {
  const context = {
    selectedFileName: 'multiColorAverage15x.mp4',
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
