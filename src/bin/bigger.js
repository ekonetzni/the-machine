require('dotenv').config();
const { dump, control, exit, bailNoValidFiles } = require('../utils');
const machine = require('../machine');
const fs = require('fs');

const readImage = require('../methods/readImage');
const getArrayData = require('../methods/getArrayData');
const makePainting = require('../methods/makePainting');
const writeImage = require('../methods/writeImage');

const _log = msg => control(msg, 'Biggerer');

const filesFromArgs = args => {
  const paths = args.slice(2).filter(file => fs.existsSync(file));
  if (!paths.length) {
    _log('No valid files provided');
    bailNoValidFiles();
  }
  return paths;
};

const filesFromDirectory = args =>
  fs.readdirSync(args[2])
    .filter(file => file.split('.').pop() === 'jpg');

const resize = machine([
  readImage,
  getArrayData,
  makePainting,
  writeImage,
  exit
]);

const method =
  fs.lstatSync(process.argv[2]).isDirectory()
    ? filesFromDirectory
    : filesFromArgs;

method(process.argv).forEach(async path => {
  const r = await resize(path, {
    selectedFileName: path.split('/').pop()
  });
}
