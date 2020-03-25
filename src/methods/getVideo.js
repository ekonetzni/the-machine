/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const fs = require('fs');
const util = require('util');
const stream = require('stream');
const ytdl = require('ytdl-core');

const METHOD_NAME = 'getVideo';
const _log = msg => control(msg, METHOD_NAME);

const YT_URL = 'http://www.youtube.com/watch?v=';

const _download = async ({ videoId, destinationPath }) => {
  const pipeline = util.promisify(stream.pipeline);
  const read = ytdl(`${YT_URL}${videoId}`, {
    filter: format => format.container === 'mp4'
  });
  const write = fs.createWriteStream(destinationPath);

  return await pipeline(read, write);
};

const _getFirstVideo = basePath =>
  fs.readdirSync(basePath).find(fileName => fileName.includes('mp4'));

const _epochNow = () => (new Date() / 1000).toPrecision(12);

const TEST_FILE = '1585162969.01-Coronavirus in Mexico President blamed for slow reaction.mp4';
// currentTarget needs to be a videoId
const getVideo = async (currentTarget, args) => {
  const { settings } = args.context;
  const fileName = `${_epochNow()}-${args.context.selectedTitle}.mp4`;
  const destinationPath = `${settings.source}/${fileName}`;

  let result;
  if (!process.env.SKIP_DOWNLOAD) {
    await _download({
      videoId: currentTarget,
      destinationPath
    });
    result = destinationPath;
  } else {
    _log('SKIPPING DOWNLOAD');
    result = `${settings.source}/${TEST_FILE}`;
  }

  return {
    result,
    name: METHOD_NAME,
    args: {
      ...args,
      context: {
        ...args.context,
        selectedFileName: process.env.SKIP_DOWNLOAD ? TEST_FILE : fileName
      }
    }
  };
};

module.exports = getVideo;
