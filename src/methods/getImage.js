/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const cv = require('opencv4nodejs');

const METHOD_NAME = 'getImage';
const _log = msg => control(msg, METHOD_NAME);

const getImage = async (currentTarget, args) => {
  const video = new cv.VideoCapture(currentTarget);
  let frame = video.read();
  while (frame.empty) {
    frame = video.read();
  }

  return {
    result: frame,
    name: METHOD_NAME,
    args
  };
};

module.exports = getImage;

