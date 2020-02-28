/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const cv = require('opencv4nodejs');

const METHOD_NAME = 'readImage';
const _log = msg => control(msg, METHOD_NAME);

const readImage = async (currentTarget, args) => ({
  result: cv.imread(currentTarget),
  name: METHOD_NAME,
  args
});

module.exports = readImage;
