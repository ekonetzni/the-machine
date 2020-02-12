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
  })
  const write = fs.createWriteStream(destinationPath);

  return await pipeline(read, write);
};

const getVideo = async (currentTarget, args) => {
  const { settings } = args.context;
  const destinationPath = `${settings.source}/${currentTarget}-${args.context.selectedTitle}.mp4`;

  let result;
  try {
    await _download({
      videoId: currentTarget,
      destinationPath
    });
    result = destinationPath;
  } catch (err) {
    throw new Error(err);
  }

  return {
    result,
    name: METHOD_NAME,
    args
  };
};

module.exports = getVideo;

