/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control, getRandomInt, writeBlob } = require('../utils');

const mutation = require('../modifiers/midlineWithBoundingRectangle');

const METHOD_NAME = 'paintFaces';
const _log = msg => control(msg, METHOD_NAME);

const paintFaces = async (currentTarget, args) => {
  const { faceRectangles } = args.context;

  let result;
  // This kind of needs to done in place, unless we pipe it to fs
  // while we work, which just seems like a nightmare.
  _log(
    `Received target of dimensions ${currentTarget.length}, ${currentTarget[0].length}`
  );
  result = mutation(faceRectangles, currentTarget);

  // Hacking here to try to keep memory footprint a bit lower.
  currentTarget = [];
  _log(
    `After processing, target has dimensions ${result.length}, ${result[0].length}`
  );

  if (process.env.DEBUG) { writeBlob('./faces.json', result) };

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
  const painting = await paintFaces(require('../mocks/multiColor.json'), {
    context
  });

  //writeBlob('./testData.json', painting.result);
  const written = await writeImage(painting.result, {
    context
  });
};

// __fire();

module.exports = paintFaces;
