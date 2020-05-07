/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control, getRandomInt, writeBlob } = require('../utils');
const convertRgbToHsl = require('../utils/convertHgbToHsl');

const METHOD_NAME = 'createColorChart';
const _log = msg => control(msg, METHOD_NAME);

const h = 0;
const s = 1;
const l = 2;

const _sortHsl = (a, b) => {
  // compare hue first
  if (a[h] < b[h]) {
    return -1;
  } else if (a[h] > b[h]) {
    return 1;
  }

  // hue must be equal, compare saturation
  if (a[s] < b[s]) {
    return -1;
  } else if (a[s] > b[s]) {
    return 1;
  }

  // saturation also equal? compare luminosity.
  if (a[l] < b[l]) {
    return -1;
  } else if (a[l] > b[l]) {
    return 1;
  }

  // haven't returned, guess they're the same.
  return 0;
};

const createColorChart = method => async (currentTarget, args) => {
  return {
    result,
    name: METHOD_NAME,
    args,
  };
};

const __fire = async () => {
  const context = {
    selectedFileName: 'multiColorAverage15x.mp4',
    settings: require('config').get('settings'),
  };

  const writeImage = require('./writeImage');
  const painting = await createColorChart(require('../mocks/multiColor.json'), {
    context,
  });

  //writeBlob('./testData.json', painting.result);
  const written = await writeImage(painting.result, {
    context,
  });
};

// __fire();

module.exports = createColorChart;
