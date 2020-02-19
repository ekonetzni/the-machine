require('dotenv').config();
const { dump, control, exit } = require('./utils');
const config = require('config');
const settings = config.get('settings');

const getQueries = require('./methods/getQueries');
const selectTitle = require('./methods/selectTitle');
const selectVideoId = require('./methods/selectVideoId');
const getVideo = require('./methods/getVideo');
const getImage = require('./methods/getImage');
const getArrayData = require('./methods/getArrayData');
const makePainting = require('./methods/makePainting');
const writeImage = require('./methods/writeImage');
const publishImage = require('./methods/publishImage');
const cleanup = require('./methods/cleanup');

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

  return await currentMethod(result, {
    params: args.params,
    context: args.context
  });
};

const execute = methods => async (initialTarget = {}) => {
  const initialValue = {
    result: initialTarget,
    name: 'initial',
    args: {
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

const sequence = [
  getQueries,
  selectTitle,
  selectVideoId,
  getVideo,
  getImage,
  getArrayData,
  makePainting,
  writeImage,
  publishImage,
  cleanup,
  exit
];

const constructVideo = execute(sequence);
constructVideo({});
