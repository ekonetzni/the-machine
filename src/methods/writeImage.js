/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');
const cv = require('opencv4nodejs');

const METHOD_NAME = 'writeImage';
const _log = msg => control(msg, METHOD_NAME);

const writeImage = async (currentTarget, args) => {
  const { selectedFileName, settings } = args.context;
  const destinationPath = `${settings.output}/${selectedFileName}.jpg`;

  try {
    _log(`Writing painting into ${destinationPath}`);
    const mat = new cv.Mat(currentTarget, cv.CV_16SC3);
    console.log(mat);
    cv.imwrite(destinationPath, mat);
  } catch (err) {
    _log(`Painting is dead. ${err}`);
  }

  return {
    result: destinationPath,
    name: METHOD_NAME,
    args
  };
};

const __fire = async () => {
  const result = await writeImage(
    require('../mocks/paintingArrayData.json'),
    {
      context:
      {
        selectedFileName: 'Thisisatest.mp4',
        settings: {
          output: './media/output'
        }
      }
    }
  );
}

module.exports = writeImage;
