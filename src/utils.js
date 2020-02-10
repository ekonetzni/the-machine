const util = require('util');
const config = require('config');

module.exports = {
  dump: obj => util.inspect(obj, { showHidden: false, depth: null }),
  control: (msg, name = '') => console.log(`[Control] {${name}} ${msg}`)
};
