/*!
 * Bitmap code borrowed from Mr Coles.
 * Modified to meet the needs of the machine.
 *
 * Generate Bitmap Data URL
 * http://mrcoles.com/low-res-paint/
 *
 */
import btoa from 'btoa';

const _toHex = value => String.fromCharCode(value);

const _asLittleEndianHex = (value: number, bytes: number): string => {
  // Convert value into little endian hex bytes
  // value - the number as a decimal integer (representing bytes)
  // bytes - the number of bytes that this value takes up in a string

  // Example:
  // _asLittleEndianHex(2835, 4)
  // > '\x13\x0b\x00\x00'

  let result = [];
  for (; bytes > 0; bytes--) {
    // Push masked value to array
    // and shift one right.
    result.push(_toHex(value & 255));
    value >>= 8;
  }

  return result.join('');
};

const _collapseData = (rows, row_padding) => {
  // Convert rows of RGB arrays into BMP data
  let i,
    j,
    pixel,
    padding = '',
    result = [];
  const rows_len = rows.length;
  const pixels_len = rows_len ? rows[0].length : 0;

  for (; row_padding > 0; row_padding--) {
    padding += '\x00';
  }

  for (i = 0; i < rows_len; i++) {
    for (j = 0; j < pixels_len; j++) {
      pixel = rows[i][j];
      result.push(`${_toHex(pixel[0])}${_toHex(pixel[1])}${_toHex(pixel[2])}`);
    }
    result.push(padding);
  }

  return result.reverse().join('');
};

type RGB = Array<[number, number, number]>;

const generateBitmapData = (rows: Array<Array<RGB>>) => {
  // Expects rows starting in bottom left
  // formatted like this: [[[255, 0, 0], [255, 255, 0], ...], ...]
  // which represents: [[red, yellow, ...], ...]
  const stringBytes = 4;
  const height = _asLittleEndianHex(rows.length, stringBytes); // the number of rows
  const width = _asLittleEndianHex(height ? rows[0].length : 0, stringBytes); // the number of columns per row
  const row_padding = (4 - ((width * 3) % 4)) % 4; // pad each row to a multiple of 4 bytes
  const num_data_bytes = _asLittleEndianHex(
    (width * 3 + row_padding) * height,
    stringBytes
  ); // size in bytes of BMP data
  const num_file_bytes = _asLittleEndianHex(54 + num_data_bytes, stringBytes); // full header size (offset) + size of data
  let file;

  // these are the actual bytes of the file...
  file =
    'BM' + // "Magic Number"
    num_file_bytes + // size of the file (bytes)*
    '\x00\x00' + // reserved
    '\x00\x00' + // reserved
    '\x36\x00\x00\x00' + // offset of where BMP data lives (54 bytes)
    '\x28\x00\x00\x00' + // number of remaining bytes in header from here (40 bytes)
    width + // the width of the bitmap in pixels*
    height + // the height of the bitmap in pixels*
    '\x01\x00' + // the number of color planes (1)
    '\x18\x00' + // 24 bits / pixel
    '\x00\x00\x00\x00' + // No compression (0)
    num_data_bytes + // size of the BMP data (bytes)*
    '\x13\x0B\x00\x00' + // 2835 pixels/meter - horizontal resolution
    '\x13\x0B\x00\x00' + // 2835 pixels/meter - the vertical resolution
    '\x00\x00\x00\x00' + // Number of colors in the palette (keep 0 for 24-bit)
    '\x00\x00\x00\x00' + // 0 important colors (means all colors are important)
    _collapseData(rows, row_padding);

  return btoa(file);
};

module.exports = generateBitmapData;
