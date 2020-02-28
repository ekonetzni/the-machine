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

/* What's hilarious about this function is how poorly it scales. */
const readTitles = directory => {
  // Gives us the timestamp at index 1
  // Gives us the name at index 2.
  const regex = /([0-9]{10}\.[0-9]{1,})-(.*)\..*\.[a-z0-9]*$/;

  const _date = timestamp => {
    const d = new Date(timestamp * 1000);
    return `${d.getFullYear()}`;
  };

  return fs.readdirSync(directory).map(fileName => {
    const tags = regex.exec(fileName);
    return tags ? tags[2] || null : null;
  });
};

const bailNoValidFiles = () => {
  control('Bailing because we have no valid files to biggen.', 'NoValidFiles');
  process.exit(3);
};
const bailNoUniqueTitle = () => {
  control(
    "Bailing on this run because we don't have a new unique title",
    'bailNoUniqueTitle'
  );
  process.exit(2);
};
const exit = () => {
  control('One step closer to Eden.', 'Machine');
  process.exit(0);
};

module.exports = {
  dump,
  control,
  writeBlob,
  getRandomInt,
  readTitles,
  bailNoUniqueTitle,
  bailNoValidFiles,
  exit
};
