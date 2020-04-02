/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const cv = require('opencv4nodejs');

const METHOD_NAME = 'findFaceRectangles';
const _log = msg => control(msg, METHOD_NAME);

const _sortByNumDetections = result => result.numDetections
  .map((num, idx) => ({ num, idx }))
  .sort(((n0, n1) => n1.num - n0.num))
  .map(({ idx }) => idx);

const findFaceRectangles = async (currentTarget, args) => {
  const video = new cv.VideoCapture(currentTarget);
  const faceClassifier =
    new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_DEFAULT);

  let frameNum = 1;
  let frame = video.read();
  let isFaceFound = false;
  let rectangle;
  let faces;
  // Assume 30 frames per second, read video in 5
  // second increments looking for a face
  // (every 150 frames)
  while (frame && !isFaceFound) {
    frameNum += 1;
    frame = video.read();
    if (frameNum % 150 === 0) {
      faces =
        faceClassifier.detectMultiScale(
          frame.bgrToGray(),
          1.03,
          50
        );
      isFaceFound = !!faces.objects.length

      if (process.env.DEBUG) { _log(faces); }

      const { selectedFileName, settings } = args.context;
      const processedFileName = `ORIGINAL-${selectedFileName}.jpg`;
      const destinationPath = `${settings.output}/${processedFileName}`;
      cv.imwrite(destinationPath, frame);
    }
  }

  _log(`Found faces on frame ${frameNum}`);

  return {
    result: frame,
    name: METHOD_NAME,
    args: {
      ...args,
      context: {
        ...args.context,
        faceRectangles: faces.objects
      }
    }
  };
};

module.exports = findFaceRectangles;
