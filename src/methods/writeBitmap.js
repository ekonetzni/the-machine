const { control } = require('../utils');
const generateBitmap = require('../bmp.js');

const METHOD_NAME = 'writeBitmap';
const _log = msg => control(msg, METHOD_NAME);

const writeBitmap = async (currentTarget, args) => {
  const { selectedFileName, settings } = args.context;
  const processedFileName = `${selectedFileName}.bmp`;
  const destinationPath = `${settings.output}/${processedFileName}`;

  _log('About to write bitmap');
  const bmp = generateBitmap(currentTarget);
  require('fs').writeFileSync(destinationPath, bmp, 'base64');

  return {
    result: destinationPath,
    name: METHOD_NAME,
    args: {
      ...args,
      context: {
        ...args.context,
        processedFileName
      }
    }
  };
};

const __fire = async (data = null) => {
  const result = await writeBitmap(
    data || require('../mocks/paintingArrayData.json'),
    {
      context: {
        selectedFileName: 'Thisisatest.mp4',
        settings: require('config').get('settings')
      }
    }
  );
};

__fire();

module.exports = writeBitmap;
