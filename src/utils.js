const util = require('util');

module.exports = {
  dump: obj => util.inspect(obj, { showHidden: false, depth: null }),
  control: msg => console.log(`[Control] ${msg}`)
};
