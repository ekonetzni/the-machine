require('dotenv').config();
const { dump, control } = require('./utils');
const config = require('config');
const settings = config.get('settings');

const getQueries = require('./methods/getQueries');
const selectTitle = require('./methods/selectTitle');
const selectVideoId = require('./methods/selectVideoId');
const getVideo = require('./methods/getVideo');

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
  control(`previousResult is ${dump(previousResult)} at index ${index}`);
  control(`About to execute ${currentMethod.name}`);

  return await currentMethod(result, {
    previousTargets: [...args.previousTargets, result],
    params: args.params,
    context: args.context
  });
};

const execute = methods => async (initialTarget = {}) => {
  const initialValue = {
    result: initialTarget,
    name: 'initial',
    args: {
      previousTargets: [],
      params: {},
      context: {
        settings
      }
    }
  };
  control(`Beginning execution`);
  const result = await methods.reduce(executor, initialValue);
  control(`Result ${dump(result)}`);
};

const constructVideo = execute([getQueries, selectTitle, selectVideoId, getVideo]);
constructVideo({});
