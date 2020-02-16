/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');

const METHOD_NAME = 'selectTitle';
const _log = msg => control(msg, METHOD_NAME);
const _promisify = value => new Promise(() => value);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
};

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
