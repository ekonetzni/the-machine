const _asLittleEndianHex = (value, bytes) => {
  // Convert value into little endian hex bytes
  // value - the number as a decimal integer (representing bytes)
  // bytes - the number of bytes that this value takes up in a string

  // Example:
  // _asLittleEndianHex(2835, 4)
  // > '\x13\x0b\x00\x00'

  var result = [];
  _log(`Called with ${value}`);

  for (; bytes > 0; bytes--) {
    result.push(String.fromCharCode(value & 255));
    value >>= 8;
  }

  return result.join('');
}

const _collapseData = (rows, row_padding) => {
  // Convert rows of RGB arrays into BMP data
  var i,
    rows_len = rows.length,
    j,
    pixels_len = rows_len ? rows[0].length : 0,
    pixel,
    padding = '',
    result = [];

  for (; row_padding > 0; row_padding--) {
    padding += '\x00';
  }

  for (i = 0; i < rows_len; i++) {
    for (j = 0; j < pixels_len; j++) {
      pixel = rows[i][j];
      result.push(
        String.fromCharCode(pixel[2]) +
        String.fromCharCode(pixel[1]) +
        String.fromCharCode(pixel[0])
      );
    }
    result.push(padding);
  }

  return result.join('');
}

const generateBitmapDataURL = (rows, scale = 1) => {
  // Expects rows starting in bottom left
  // formatted like this: [[[255, 0, 0], [255, 255, 0], ...], ...]
  // which represents: [[red, yellow, ...], ...]

  var height = rows.length,                              // the number of rows
    width = height ? rows[0].length : 0,                 // the number of columns per row
    row_padding = (4 - (width * 3) % 4) % 4,             // pad each row to a multiple of 4 bytes
    num_data_bytes = (width * 3 + row_padding) * height, // size in bytes of BMP data
    num_file_bytes = 54 + num_data_bytes,                // full header size (offset) + size of data
    file;
  _log(`height ${height}, width ${width}, num_data_bytes ${num_data_bytes}`)

  height = _asLittleEndianHex(height, 4);
  width = _asLittleEndianHex(width, 4);
  num_data_bytes = _asLittleEndianHex(num_data_bytes, 4);
  num_file_bytes = _asLittleEndianHex(num_file_bytes, 4);

  // these are the actual bytes of the file...

  file = ('BM' +               // "Magic Number"
    num_file_bytes +     // size of the file (bytes)*
    '\x00\x00' +         // reserved
    '\x00\x00' +         // reserved
    '\x36\x00\x00\x00' + // offset of where BMP data lives (54 bytes)
    '\x28\x00\x00\x00' + // number of remaining bytes in header from here (40 bytes)
    width +              // the width of the bitmap in pixels*
    height +             // the height of the bitmap in pixels*
    '\x01\x00' +         // the number of color planes (1)
    '\x18\x00' +         // 24 bits / pixel
    '\x00\x00\x00\x00' + // No compression (0)
    num_data_bytes +     // size of the BMP data (bytes)*
    '\x13\x0B\x00\x00' + // 2835 pixels/meter - horizontal resolution
    '\x13\x0B\x00\x00' + // 2835 pixels/meter - the vertical resolution
    '\x00\x00\x00\x00' + // Number of colors in the palette (keep 0 for 24-bit)
    '\x00\x00\x00\x00' + // 0 important colors (means all colors are important)
    _collapseData(rows, row_padding)
  );

  // TODO: This technique works if we need to store hex...but we don't?
  return require('btoa')(file);
};

/* Methods signature (currentTarget, args: {previousTargets: [], params, context, name }): {
 *   result: any
 *   name: string
 *   args: {previousTargets: [], params, context, name })
 * }
 */
const { control } = require('../utils');

const METHOD_NAME = 'writeBitmap';
const _log = msg => control(msg, METHOD_NAME);

const writeBitmap = async (currentTarget, args) => {
  const { selectedFileName, settings } = args.context;
  const processedFileName = `${selectedFileName}.bmp`;
  const destinationPath = `${settings.output}/${processedFileName}`;

  _log('About to write bitmap');
  const bmp = generateBitmapDataURL(currentTarget);
  //const file = `<html><body><img src='data:image/bmp;base64,${bmp}' /></body></html>`;
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
