require('dotenv').config();
const { dump, control, logError, exit } = require('./utils');
const config = require('config');
const settings = config.get('settings');

/*
 * Machine methods - use this to enforce the function signature.
 * Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
   result: any
   name: string
   args: {previousTargets: [], params, context, name })
 }
 */

/*
 * - Retrieve feeds from RSS (feedparser) - Title
 * - Dedupe against titles we've used - Title
 * - Search and download video content based on title - FileName
 * - Process video down to image - Image
 * - Clean up
 */

const executor = async (previousResult, currentMethod, index) => {
  const { result, args } = await previousResult;
  control(`Executing ${currentMethod.name}`);

  try {
    return await currentMethod(result, {
      params: args.params,
      context: args.context
    });
  } catch (err) {
    logError('Machine', err);
    if (process.env.DEBUG) { throw (err) };
  }
};

const execute = methods => async (initialTarget = {}, context = {}) => {
  const initialValue = {
    result: initialTarget,
    name: 'initial',
    args: {
      params: {},
      context: {
        settings,
        ...context
      }
    }
  };
  control(`Beginning execution`);
  const result = await methods.reduce(executor, initialValue);
  control(`Result ${dump(result)}`);
};

module.exports = execute;
