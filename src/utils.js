const util = require('util');
const config = require('config');
const fs = require('fs');

const writeBlob = (path, arrayData) =>
  fs.writeFileSync(path, JSON.stringify(arrayData));

module.exports = {
  dump: obj => util.inspect(obj, { showHidden: false, depth: null }),
  control: (msg, name = '') => console.log(`[Control] {${name}} ${msg}`),
  writeBlob
};
