/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const cv = require('opencv4nodejs');

const METHOD_NAME = 'getArrayData';

const getArrayData = async (currentTarget, args) => ({
  result: currentTarget.getDataAsArray(),
  name: METHOD_NAME,
  args
});

module.exports = getArrayData;

