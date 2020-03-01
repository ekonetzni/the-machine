/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const cv = require('opencv4nodejs');

const METHOD_NAME = 'getFrame';
const _log = msg => control(msg, METHOD_NAME);

const getFrame = async (currentTarget, args) => {
  const video = new cv.VideoCapture(currentTarget);
  let frame = video.read();
  let i = 0;
  while (frame.empty || i < 300) {
    // This reads about 10ish seconds into the video
    // use to avoid blank title screens.
    frame = video.read();
    i++;
  }
  _log(`Return frame ${frame}`);

  return {
    result: frame,
    name: METHOD_NAME,
    args
  };
};

module.exports = getFrame;
