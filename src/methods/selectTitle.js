/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control, getRandomInt } = require('../utils');

const METHOD_NAME = 'selectTitle';
const _log = msg => control(msg, METHOD_NAME);
const _promisify = value => new Promise(() => value);

// TODO: There's an opportunity for meaningful choices that I am missing here.
const _select = arr => arr[getRandomInt(0, arr.length)];

const selectTitle = async (currentTarget, args) => {
  const result = Array.isArray(currentTarget) ? _select(currentTarget) : '';
  return {
    result: result,
    name: METHOD_NAME,
    args: {
      ...args,
      context: {
        ...args.context,
        selectedTitle: result
      }
    }
  };
};

module.exports = selectTitle;
