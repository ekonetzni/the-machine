/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const fs = require('fs');
const ytdl = require('ytdl-core');

const METHOD_NAME = 'getVideo';
const _log = msg => control(msg, METHOD_NAME);

const YT_URL = 'http://www.youtube.com/watch?v=';

const _download = async ({ videoId, basePath, videoTitle }) => {
  const destinationPath = `${basePath}/${videoId}-${videoTitle}.mp4`;
  const stream = ytdl(`${YT_URL}${videoId}`, {
    filter: format => format.container === 'mp4'
  })
  stream.pipe(fs.createWriteStream(destinationPath));
  return await new Promise(resolve => stream.on('close', resolve(destinationPath)));
};

const getVideo = async (currentTarget, args) => {
  const { settings } = args.context;

  const result = await _download({
    videoId: currentTarget,
    videoTitle: args.context.selectedTitle,
    basePath: settings.source
  });

  return {
    result,
    name: METHOD_NAME,
    args
  };
};

module.exports = getVideo;

