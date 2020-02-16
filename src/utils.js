const util = require('util');
const config = require('config');
const fs = require('fs');

const writeBlob = (path, arrayData) =>
  fs.writeFileSync(path, JSON.stringify(arrayData));

const dump = obj => util.inspect(obj, { showHidden: false, depth: null });
const control = (subject, name = '') =>
  console.log(`[Control] {${name}} ${typeof subject === 'string' ? subject : dump(subject)}`);

module.exports = {
  dump,
  control,
  writeBlob
};
