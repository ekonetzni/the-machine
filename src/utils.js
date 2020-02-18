const util = require('util');
const config = require('config');
const fs = require('fs');

const writeBlob = (path, arrayData) =>
  fs.writeFileSync(path, JSON.stringify(arrayData));

const dump = obj => util.inspect(obj, { showHidden: false, depth: null });
const control = (subject, name = '') =>
  console.log(
    `[Control] {${name}} ${
      typeof subject === 'string' ? subject : dump(subject)
    }`
  );

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max + 1);
  return Math.floor(Math.random() * (max - min)) + min;
};

module.exports = {
  dump,
  control,
  writeBlob,
  getRandomInt
};
